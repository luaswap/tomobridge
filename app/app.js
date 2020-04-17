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
import TrezorConnect from 'trezor-connect'

// abis
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

// set up trezor's manifest
TrezorConnect.manifest({
    email: 'admin@tomochain.com',
    appUrl: 'https://bridge.tomochain.com'
})

Vue.prototype.setupProvider = async function (provider, web3) {
    Vue.prototype.NetworkProvider = provider
    if (web3 instanceof Web3) {
        Vue.prototype.web3 = web3
        const config = await getConfig()
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
            await window.ethereum.enable()
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

const getConfig = Vue.prototype.appConfig = async function () {
    let config = await axios.get('/api/config')
    config.data.objSwapCoin = {}
    config.data.swapCoin.forEach(c => {
        config.data.objSwapCoin[c.name.toLowerCase()] = c
    })

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
    }
}

Vue.prototype.changeTokenName = function (token) {
    return token.replace('TOMO', 'TRC21 ')
}

Vue.prototype.string2byte = function (str) {
    let byteArray = []
    for (let j = 0; j < str.length; j++) {
        byteArray.push(str.charCodeAt(j))
    }

    return byteArray
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
