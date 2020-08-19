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
import TransactionTx from 'ethereumjs-tx'
import * as localStorage from 'store'
import VueI18n from 'vue-i18n'
import TrezorConnect from 'trezor-connect'
import _get from 'lodash.get'
import _omit from 'lodash.omit'

import WrapperAbi from '../abis/WrapperAbi.json'

// Components
import Home from './components/Home.vue'
import WrapExecution from './components/wrap/WrapExecution.vue'
import UnWrapExecution from './components/unwrap/UnWrapExecution.vue'
import Transaction from './components/Transaction.vue'
import UnWrapDirect from './components/unwrap/UnWrapDirect.vue'
import en from './assets/translation/en.json'
import vi from './assets/translation/vi.json'
import tr from './assets/translation/tr.json'
import ja from './assets/translation/ja.json'
import cn from './assets/translation/cn.json'

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
    },
    singleton: true
})
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en,
        vi,
        tr,
        ja,
        cn
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

// set up trezor's manifest
TrezorConnect.manifest({
    email: 'admin@tomochain.com',
    appUrl: 'https://bridge.tomochain.com'
})

Vue.prototype.setupProvider = async function (provider, wjs) {
    Vue.prototype.NetworkProvider = provider
    if (wjs instanceof Web3) {
        Vue.prototype.web3 = wjs
        Vue.prototype.WrapperAbi = WrapperAbi
        let config = localStorage.get('configBridge')
        const { data } = await axios.get('/api/config/getTokenConfig')
        config.swapCoin = data.swapCoin
        config.objSwapCoin = data.objSwapCoin
        localStorage.set('configBridge', config)
    }
}

Vue.prototype.getAccount = async function (resolve, reject) {
    const provider = Vue.prototype.NetworkProvider || ''
    const web3 = Vue.prototype.web3
    let account
    switch (provider) {
    case 'metamask':
        // Request account access if needed - for metamask
        if (window.ethereum) {
            // await window.ethereum.enable()
            window.ethereum.request({ method: 'eth_requestAccounts' })
        }
        account = (await web3.eth.getAccounts())[0]
        break
    case 'pantograph':
        // Request account access if needed - for pantograph
        if (window.tomochain) {
            await window.tomochain.enable()
        }
        account = (await web3.eth.getAccounts())[0]
        break
    case 'privateKey':
        account = (await web3.eth.getAccounts())[0]
        break
    case 'tomowallet':
        account = (await web3.eth.getAccounts())[0]
        break
    case 'custom':
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
    case 'trezor':
        const payload = Vue.prototype.trezorPayload || localStorage.get('trezorPayload')
        const offset = localStorage.get('offset')
        account = Vue.prototype.HDWalletCreate(
            payload,
            offset
        )
        localStorage.set('trezorPayload', { xpub: payload.xpub })
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

Vue.prototype.unlockTrezor = async () => {
    try {
        const result = await TrezorConnect.getPublicKey({
            path: localStorage.get('hdDerivationPath')
        })
        Vue.prototype.trezorPayload = result.payload
    } catch (error) {
        console.log(error)
        throw error
    }
}

Vue.prototype.loadTrezorWallets = async (offset, limit) => {
    try {
        const wallets = {}
        const payload = Vue.prototype.trezorPayload
        if (payload && !payload.error) {
            let convertedAddress
            let balance
            let web3
            if (!Vue.prototype.web3) {
                await Vue.prototype.detectNetwork('trezor')
            }
            web3 = Vue.prototype.web3
            for (let i = offset; i < (offset + limit); i++) {
                convertedAddress = Vue.prototype.HDWalletCreate(payload, i)
                balance = await web3.eth.getBalance(convertedAddress)
                wallets[i] = {
                    address: convertedAddress,
                    balance: parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(2)
                }
            }
            return wallets
        } else {
            throw payload.error || 'Something went wrong'
        }
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

/**
 * @param object txParams
 * @return object signature {r, s, v}
 */
Vue.prototype.signTransaction = async function (txParams) {
    try {
        const path = localStorage.get('hdDerivationPath')
        const provider = Vue.prototype.NetworkProvider
        let signature
        if (provider === 'ledger') {
            const config = localStorage.get('configBridge') || await getConfig()
            const chainConfig = config.blockchain
            const rawTx = new TransactionTx(txParams)
            rawTx.v = Buffer.from([chainConfig.networkId])
            const serializedRawTx = rawTx.serialize().toString('hex')
            signature = await Vue.prototype.appEth.signTransaction(
                path,
                serializedRawTx
            )
        }
        if (provider === 'trezor') {
            const result = await TrezorConnect.ethereumSignTransaction({
                path,
                transaction: txParams
            })
            signature = result.payload
        }
        return signature
    } catch (error) {
        console.log(error)
        throw error
    }
}

/**
 * @param object txParams
 * @param object signature {r,s,v}
 * @return transactionReceipt
 */
Vue.prototype.sendSignedTransaction = function (txParams, signature) {
    return new Promise((resolve, reject) => {
        try {
            // "hexify" the keys
            Object.keys(signature).map((key, _) => {
                if (signature[key].startsWith('0x')) {
                    return signature[key]
                } else signature[key] = '0x' + signature[key]
            })
            let txObj = Object.assign({}, txParams, signature)
            let tx = new TransactionTx(txObj)
            let serializedTx = '0x' + tx.serialize().toString('hex')
            // web3 v0.2, method name is sendRawTransaction
            // You are using web3 v1.0. The method was renamed to sendSignedTransaction.
            Vue.prototype.web3.eth.sendSignedTransaction(
                serializedTx
            ).on('transactionHash', (txHash) => {
                resolve(txHash)
            }).catch(error => reject(error))
            // if (!rs.tx && rs.transactionHash) {
            //     rs.tx = rs.transactionHash
            // }
        } catch (error) {
            reject(error)
        }
    })
}

Vue.prototype.detectNetwork = async function (provider) {
    try {
        let wjs = this.web3
        if (!wjs) {
            switch (provider) {
            case 'metamask':
                if (window.ethereum) {
                    var p = window.ethereum
                    wjs = new Web3(p)
                }
                break
            case 'tomowallet':
                if (window.web3) {
                    var pv = window.web3.currentProvider
                    wjs = new Web3(pv)
                }
                break
            case 'pantograph':
                if (window.tomoWeb3) {
                    if (window.tomoWeb3.currentProvider) {
                        let pp = window.tomoWeb3.currentProvider
                        wjs = new Web3(pp)
                    } else {
                        wjs = window.tomoWeb3
                    }
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
                const config = localStorage.get('configBridge') || await getConfig()
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
        throw error
    }
}

Vue.prototype.string2byte = function (str) {
    let byteArray = []
    for (let j = 0; j < str.length; j++) {
        byteArray.push(str.charCodeAt(j))
    }

    return byteArray
}

Vue.prototype.setStorage = (key, object) => {
    sessionStorage.setItem(
        'global',
        JSON.stringify({
            ...JSON.parse(sessionStorage.getItem('global')),
            [key]: object
        })
    )
}

Vue.prototype.getStorage = key => {
    return _get(JSON.parse(sessionStorage.getItem('global')), [key])
}

Vue.prototype.removeStorage = key => {
    sessionStorage.setItem(
        'global',
        JSON.stringify(_omit(JSON.parse(sessionStorage.getItem('global')), key))
    )
}

Vue.prototype.serializeQuery = function (params, prefix) {
    const query = Object.keys(params).map((key) => {
        const value = params[key]

        if (params.constructor === Array) {
            key = `${prefix}[]`
        } else {
            if (params.constructor === Object) {
                key = (prefix ? `${prefix}[${key}]` : key)
            }
        }

        return value === 'object' ? this.serializeQuery(value, key) : `${key}=${encodeURIComponent(value)}`
    })

    return [].concat.apply([], query).join('&')
}

Vue.prototype.truncate = function (fullStr, strLen) {
    if (fullStr.length <= strLen) return fullStr

    const separator = '...'

    let sepLen = separator.length
    let charsToShow = strLen - sepLen
    let frontChars = Math.ceil(charsToShow / 2)
    let backChars = Math.floor(charsToShow / 2)

    return fullStr.substr(0, frontChars) +
       separator +
       fullStr.substr(fullStr.length - backChars)
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/wrap', component: Home },
        { path: '/wrap/:tokenSymbol', component: Home },
        { path: '/unwrap/:tokenSymbol', component: Home },
        { path: '/wrapToken', component: WrapExecution, name: 'WrapExecution' },
        { path: '/unwrapToken', component: UnWrapExecution, name: 'UnWrapExecution' },
        { path: '/txs', component: Transaction, name: 'Transaction' },
        { path: '/withdraw/:token/:address', component: UnWrapDirect }
    ]
})

router.beforeEach(async (to, from, next) => {
    const provider = Vue.prototype.NetworkProvider || (Vue.prototype.getStorage('account') || {}).network || null
    await Vue.prototype.detectNetwork(provider)
    next()
})

const getConfig = Vue.prototype.appConfig = async function () {
    let config = await axios.get('/api/config')
    config.data.objSwapCoin = {}
    config.data.swapCoin.forEach(c => {
        config.data.objSwapCoin[c.name.toLowerCase()] = c
    })
    localStorage.set('configBridge', config.data)

    return config.data
}

const EventBus = new Vue()

Vue.prototype.$bus = EventBus

new Vue({ // eslint-disable-line no-new
    el: '#app',
    i18n,
    store,
    router: router,
    components: { App },
    data: {
        language: 'en'
    },
    template: '<App/>'
})
