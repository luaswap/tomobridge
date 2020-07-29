'use strict'
const express = require('express')
const config = require('config')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const WrapperAbi = require('../abis/WrapperAbi.json')
const router = express.Router()

router.get('/', async function (req, res, next) {
    let appConfig = {}
    let swapCoin = []
    appConfig.blockchain = config.get('blockchain')
    appConfig.swapToken = config.get('swapToken')
    let tomoscanUrl = config.get('tomoscanUrl')
    if (tomoscanUrl[tomoscanUrl.length - 1] === '/') {
        tomoscanUrl = tomoscanUrl.substr(0, tomoscanUrl.length - 1)
    }
    appConfig.tomoscanUrl = tomoscanUrl

    if (swapCoin.length !== config.swapCoin.length) {
        let rpc = appConfig.blockchain.rpc
        let web3 = new Web3(rpc)
        swapCoin = await Promise.all(config.swapCoin.map(async s => {
            const c = JSON.parse(JSON.stringify(s))
            let contract = web3.eth.Contract(
                WrapperAbi.abi,
                s.wrapperAddress
            )
            const decimalsPromise = contract.methods.decimals().call() || 0
            const depositFeePromise = contract.methods.DEPOSIT_FEE().call() || 0
            const withdrawFeePromise = contract.methods.WITHDRAW_FEE().call() || 0
            const decimals = await decimalsPromise

            c.decimals = decimals
            c.depositFee = new BigNumber(await depositFeePromise).dividedBy(10 ** decimals).toString(10)
            c.withdrawFee = new BigNumber(await withdrawFeePromise).dividedBy(10 ** decimals).toString(10)
            return c
        }))
    }
    appConfig.GA = config.get('GA')

    appConfig.swapCoin = swapCoin

    return res.json(appConfig)
})

module.exports = router
