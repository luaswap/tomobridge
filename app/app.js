import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'
import Transport from '@ledgerhq/hw-transport-u2f' // for browser
import Eth from '@ledgerhq/hw-app-eth'
import * as ethUtils from 'ethereumjs-util'
import * as HDKey from 'hdkey'
import axios from 'axios'
import Web3 from 'web3'
import * as localStorage from 'store'
// abis
import EthWrapperAbi from '../abis/EthWrapperAbi.json'
// import BtcWrapperAbi from '../abis/BtcWrapperAbi.json'

// Components
import Home from './components/Home.vue'
import WrapExecution from './components/wrap/WrapExecution.vue'
import UnWrapExecution from './components/unwrap/UnWrapExecution.vue'
import Transaction from './components/Transaction.vue'

Vue.use(VueClipboard)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Toasted, {
    position: 'bottom-right',
    theme: 'bubble',
    duration: 4000,
    action : {
        text : 'Dismiss',
        onClick : (e, toastObject) => {
            toastObject.goAway(0)
        }
    }
})
const store = new Vuex.Store({
    state: {
        address: null,
        hdPath: '',
        fromWrapToken: {},
        toWrapToken: {}
    }
})

Vue.prototype.setupProvider = async function (provider, web3) {
    Vue.prototype.NetworkProvider = provider
    if (web3 instanceof Web3) {
        Vue.prototype.web3 = web3
        const config = await getConfig()
        localStorage.set('configBridge', config)
        const chainConfig = config.blockchain
        Vue.prototype.ethContract = new Vue.prototype.web3.eth.Contract(
            EthWrapperAbi.abi,
            chainConfig.ethWrappAddress
        )
        // Vue.prototype.btcContract = new Vue.prototype.web3.eth.Contract(
        //     BtcWrapperAbi.abi,
        //     chainConfig.btcWrappAddress
        // )
    }
}

Vue.prototype.getAccount = async function (resolve, reject) {
    const provider = Vue.prototype.NetworkProvider || ''
    const web3 = Vue.prototype.web3
    let account
    switch (provider) {
    case 'privateKey':
        account = (await web3.eth.getAccounts())[0]
        break
    case 'ledger':
        if (!Vue.prototype.appEth) {
            let transport = await new Transport()
            Vue.prototype.appEth = await new Eth(transport)
        }
        let ethAppConfig = await Vue.prototype.appEth.getAppConfiguration()
        if (!ethAppConfig.arbitraryDataEnabled) {
            throw new Error(`Please go to App Setting
                to enable contract data and display data on your device!`)
        }
        const result = await Vue.prototype.appEth.getAddress(
            localStorage.get('hdDerivationPath')
        )
        account = result.address
        break
    default:
        break
    }
    if (!account || account.length <= 0) {
        console.log(`Couldn't get any accounts! Make sure
            your Ethereum client is configured correctly.`)
    }
    return account
}

Vue.prototype.HDWalletCreate = (payload, index) => {
    const provider = Vue.prototype.NetworkProvider
    let derivedKey
    if (provider === 'trezor') {
        const xpub = payload.xpub
        const hdWallet = HDKey.fromExtendedKey(xpub)
        derivedKey = hdWallet.derive('m/' + index)
    } else {
        const pubKey = payload.publicKey
        const chainCode = payload.chainCode
        const hdkey = new HDKey()
        hdkey.publicKey = Buffer.from(pubKey, 'hex')
        hdkey.chainCode = Buffer.from(chainCode, 'hex')
        derivedKey = hdkey.derive('m/' + index)
    }
    let pubKey = ethUtils.bufferToHex(derivedKey.publicKey)
    const buff = ethUtils.publicToAddress(pubKey, true)

    return ethUtils.bufferToHex(buff)
}

Vue.prototype.unlockLedger = async () => {
    try {
        if (!Vue.prototype.appEth) {
            let u2fSupported = await Transport.isSupported()
            if (!u2fSupported) {
                throw new Error(`U2F not supported in this browser.
                        Please try using Google Chrome with a secure (SSL / HTTPS) connection!`)
            }
            let transport = await Transport.create()

            Vue.prototype.appEth = await new Eth(transport)
        }
        const path = localStorage.get('hdDerivationPath')

        const result = await Vue.prototype.appEth.getAddress(
            path,
            false,
            true
        )
        Vue.prototype.ledgerPayload = result
    } catch (error) {
        console.log(error)
        throw error
    }
}

Vue.prototype.loadMultipleLedgerWallets = async function (offset, limit) {
    let u2fSupported = await Transport.isSupported()
    if (!u2fSupported) {
        throw new Error(`U2F not supported in this browser.
                Please try using Google Chrome with a secure (SSL / HTTPS) connection!`)
    }
    await Vue.prototype.detectNetwork('ledger')
    if (!Vue.prototype.appEth) {
        let transport = await Transport.create()
        Vue.prototype.appEth = await new Eth(transport)
    }
    const payload = Vue.prototype.ledgerPayload
    let web3 = Vue.prototype.web3
    let balance = 0
    let convertedAddress
    let wallets = {}

    for (let i = offset; i < (offset + limit); i++) {
        convertedAddress = Vue.prototype.HDWalletCreate(payload, i)
        balance = await web3.eth.getBalance(convertedAddress)
        wallets[i] = {
            address: convertedAddress,
            balance: parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(2)
        }
    }
    Vue.prototype.ledgerPayload = ''
    return wallets
}

const getConfig = Vue.prototype.appConfig = async function () {
    let config = await axios.get('/api/config')
    return config.data
}

Vue.prototype.detectNetwork = async function (provider) {
    try {
        let wjs = this.web3
        if (!wjs) {
            switch (provider) {
            case 'tomowallet':
            case 'metamask':
                if (window.web3) {
                    var p = window.web3.currentProvider
                    wjs = new Web3(p)
                }
                break
            case 'trezor':
            case 'ledger':
                if (provider === 'ledger') {
                    if (!Vue.prototype.appEth) {
                        let transport = await Transport.create()
                        Vue.prototype.appEth = await new Eth(transport)
                    }
                }
                const config = localStorage.get('config') || await getConfig()
                const chainConfig = config.blockchain
                wjs = new Web3(new Web3.providers.HttpProvider(chainConfig.rpc))
                break
            default:
                break
            }
            await this.setupProvider(provider, wjs)
        }
    } catch (error) {
        console.log(error)
    }
}

Vue.prototype.getCurrencySymbol = function () {
    return 'TOMO'
}

Vue.prototype.string2byte = function (str) {
    let byteArray = []
    for (let j = 0; j < str.length; j++) {
        byteArray.push(str.charCodeAt(j))
    }

    return byteArray
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/wrapToken', component: WrapExecution, name: 'WrapExecution' },
        { path: '/unwrapToken', component: UnWrapExecution, name: 'UnWrapExecution' },
        { path: '/txs', component: Transaction, name: 'Transaction' }
    ]
})

const EventBus = new Vue()

Vue.prototype.$bus = EventBus

new Vue({ // eslint-disable-line no-new
    el: '#app',
    store,
    router: router,
    components: { App },
    data: {
        language: 'en'
    },
    template: '<App/>'
})
