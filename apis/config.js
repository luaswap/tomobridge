'use strict'
const express = require('express')
const config = require('config')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')
const WrapperAbi = require('../abis/WrapperAbi.json')
const router = express.Router()
let swapCoin = []

router.get('/', async function (req, res, next) {
    let appConfig = {}
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
        for (let s of config.swapCoin) {
            let c = Object.assign({}, s)
            let contract = web3.eth.Contract(
                WrapperAbi.abi,
                s.wrapperAddress
            )
            c.decimals = await contract.methods.decimals().call() || 0
            let depositFee = await contract.methods.DEPOSIT_FEE().call() || 0
            let withdrawFee = await contract.methods.WITHDRAW_FEE().call() || 0
            c.depositFee = new BigNumber(depositFee).dividedBy(10 ** c.decimals).toString(10)
            c.withdrawFee = new BigNumber(withdrawFee).dividedBy(10 ** c.decimals).toString(10)
            swapCoin.push(c)
        }
    }

    appConfig.swapCoin = swapCoin

    return res.json(appConfig)
})

module.exports = router
