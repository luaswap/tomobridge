'use strict'
const express = require('express')
const config = require('config')
const BigNumber = require('bignumber.js')
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
    let appConfig
    const { data } = await axios.get(
        urljoin(config.get('serverAPI'), 'tokens?page=1&limit=1000')
    )
    appConfig = data.Data.map(d => {
        return {
            name: d.symbol,
            confirmations: d.confirms,
            decimals: d.decimals,
            minimumDeposit: new BigNumber(d.min_deposit_value).div(10 ** d.decimals).toString(10),
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

    return res.json(appConfig)
})

module.exports = router
