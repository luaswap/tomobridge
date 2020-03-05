'use strict'
const express = require('express')
const config = require('config')
const router = express.Router()

router.get('/', function (req, res, next) {
    let appConfig = {}
    appConfig.blockchain = config.get('blockchain')
    appConfig.swapCoin = config.get('swapCoin')
    appConfig.swapToken = config.get('swapToken')
    return res.json(appConfig)
})

module.exports = router
