'use strict'
const express = require('express')
const config = require('config')
const urljoin = require('url-join')
const router = express.Router()
const axios = require('axios')
const { check, validationResult } = require('express-validator/check')

router.post('/getAddress', [
    check('wrapCoin').exists().withMessage("'wrapCoin' is required"),
    check('receiveAddress').exists().isLength({ min: 42, max: 42 }).withMessage("'account' address is incorrect.")
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const wrapCoin = req.body.wrapCoin
        const receiveAddress = req.body.receiveAddress
        const url = urljoin(config.get('serverAPI'), '/address')
        const result = await axios.post(url, {
            coin: wrapCoin,
            tomo: receiveAddress
        })
        return res.send(result.data)
    } catch (error) {
        return next(error)
    }
})

router.get('/getTransaction/:txType/:wrapCoin/:receiveAddress', [
    check('txType').exists().withMessage("'txType' is required, 'deposit' or 'withdraw'"),
    check('wrapCoin').exists().withMessage("'wrapCoin' is required"),
    check('receiveAddress').exists().isLength({ min: 42, max: 42 }).withMessage("'account' address is incorrect.")
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const wrapCoin = req.params.wrapCoin
        const receiveAddress = req.params.receiveAddress
        const txType = req.params.txType

        const url = urljoin(
            config.get('serverAPI'),
            '/transactions/',
            wrapCoin.toLowerCase(),
            receiveAddress,
            `/${txType}/latest`
        )
        const result = await axios.get(url)
        return res.send(result.data)
    } catch (error) {
        return res.send('Cannot find tx')
    }
})

module.exports = router
