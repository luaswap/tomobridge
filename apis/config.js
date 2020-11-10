'use strict'
const express = require('express')
const config = require('config')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const WrapperAbi = require('../abis/WrapperAbi.json')
const router = express.Router()
const urljoin = require('url-join')
const axios = require('axios')

const getChainInfo = (chain) => {
    switch (chain) {
    case 'BTC':
        return ['bitcoin', 'https://www.blockchain.com/btc']
    case 'ETH':
        return ['ethereum', 'https://etherscan.io']
    default:
        return ['', '']
    }
}

router.get('/', async function (req, res, next) {
    let appConfig = {}
    // const swapCoin = JSON.parse(JSON.stringify(config.get('swapCoin')))
    appConfig.blockchain = config.get('blockchain')
    appConfig.swapToken = config.get('swapToken')
    let tomoscanUrl = config.get('tomoscanUrl')
    if (tomoscanUrl[tomoscanUrl.length - 1] === '/') {
        tomoscanUrl = tomoscanUrl.substr(0, tomoscanUrl.length - 1)
    }
    appConfig.tomoscanUrl = tomoscanUrl

    appConfig.GA = config.get('GA')

    const { data } = await axios.get(
        urljoin(config.get('serverAPI'), 'tokens?page=1&limit=1000')
    )
    appConfig.swapCoin = data.Data.map(d => {
        return {
            name: d.symbol,
            confirmations: d.confirms,
            decimals: d.decimals,
            minimumWithdrawal: new BigNumber(d.min_deposit_value).div(10 ** d.decimals).toString(10),
            image: urljoin(config.get('tokenListAPI'), `${d.wrap_smart_contract.toLowerCase()}.png`),
            wrapperAddress: d.wrap_smart_contract,
            tokenName: d.name,
            network: getChainInfo(d.chain)[0],
            explorerUrl: getChainInfo(d.chain)[1],
            mainAddress: d.multisig_wallet,
            tokenAddress: d.address,
            coingecko_id: d.coingecko_id || ''
        }
    })

    // appConfig.swapCoin = await Promise.all(swapCoin.map(s => {
    //     s.image = urljoin(config.get('tokenListAPI'), `${s.wrapperAddress.toLowerCase()}.png`)
    //     return s
    // }))

    return res.json(appConfig)
})

router.get('/getTokenConfig', async function (req, res, next) {
    let appConfig = {}
    let swapCoin = []
    const blockchain = config.get('blockchain')

    if (swapCoin.length !== config.swapCoin.length) {
        let rpc = blockchain.rpc
        let web3 = new Web3(rpc)

        const { data } = await axios.get(
            urljoin(config.get('serverAPI'), 'tokens?page=1&limit=1000')
        )
        const swapCoinData = data.Data.map(d => {
            return {
                name: d.symbol,
                confirmations: d.confirms,
                decimals: d.decimals,
                minimumWithdrawal: new BigNumber(d.min_deposit_value).div(10 ** d.decimals).toString(10),
                image: urljoin(config.get('tokenListAPI'), `${d.wrap_smart_contract.toLowerCase()}.png`),
                wrapperAddress: d.wrap_smart_contract,
                tokenName: d.name,
                network: getChainInfo(d.chain)[0],
                explorerUrl: getChainInfo(d.chain)[1],
                mainAddress: d.multisig_wallet,
                tokenAddress: d.address,
                coingecko_id: d.coingecko_id || ''
            }
        })

        swapCoin = await Promise.all(swapCoinData.map(async s => {
            const c = JSON.parse(JSON.stringify(s))
            let contract = new web3.eth.Contract(
                WrapperAbi.abi,
                s.wrapperAddress
            )

            const decimalsPromise = contract.methods.decimals().call() || 0
            const depositFeePromise = contract.methods.DEPOSIT_FEE().call() || 0
            const withdrawFeePromise = contract.methods.WITHDRAW_FEE().call() || 0

            const decimals = await decimalsPromise
            const depositFee = await depositFeePromise
            const withdrawFee = await withdrawFeePromise

            c.decimals = decimals
            c.depositFee = new BigNumber(depositFee).dividedBy(10 ** decimals).toString(10)
            c.withdrawFee = new BigNumber(withdrawFee).dividedBy(10 ** decimals).toString(10)
            return c
        }))
    }
    appConfig.objSwapCoin = {}
    swapCoin.map(c => {
        appConfig.objSwapCoin[c.name.toLowerCase()] = c
    })

    appConfig.swapCoin = swapCoin

    return res.json(appConfig)
})

module.exports = router
