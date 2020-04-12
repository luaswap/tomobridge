'use strict'
const express = require('express')
const config = require('config')
const urljoin = require('url-join')
const router = express.Router()
const axios = require('axios')

router.post('/getAddress', async function (req, res, next) {
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

router.get('/getTransaction/:txType/:wrapCoin/:receiveAddress',
    async function (req, res, next) {
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
            return next(error)
        }
    })

module.exports = router
