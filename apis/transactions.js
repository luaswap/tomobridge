'use strict'
const express = require('express')
const config = require('config')
const urljoin = require('url-join')
const router = express.Router()
const axios = require('axios')
const { query, validationResult } = require('express-validator/check')

router.get('/',
    async function (req, res, next) {
        try {
            const page = req.query.page >= 1 ? req.query.page - 1 : 0 || 0
            const limit = parseInt(req.query.limit / 2) || 100
            const coin = req.query.coin || 'btc'
            let response = {
                mainTxs: [],
                wrapTxs: [],
                total: 0
            }

            const url = urljoin(
                config.get('serverAPI'),
                '/transactions',
                `?coin=${coin}&page=${page}&limit=${limit}`
            )
            const result = await axios.get(url)
            if (result && result.data) {
                response.total = result.data.Total
                await Promise.all(result.data.Data.map(item => {
                    if (item.InTx.Status === 'DEPOSITED') {
                        response.mainTxs.push(Object.assign(
                            item.InTx,
                            {
                                CreatedAt: item.CreatedAt
                            }
                        ))
                        response.wrapTxs.push(Object.assign(
                            item.OutTx,
                            {
                                CreatedAt: item.CreatedAt
                            }
                        ))
                    }
                    if (item.InTx.Status === 'BURNED') {
                        response.mainTxs.push(Object.assign(
                            item.OutTx,
                            {
                                CreatedAt: item.CreatedAt
                            }
                        ))
                        response.wrapTxs.push(Object.assign(
                            item.InTx,
                            {
                                CreatedAt: item.CreatedAt
                            }
                        ))
                    }
                }))
            }
            return res.send(response)
        } catch (error) {
            return next(error)
        }
    })

router.get('/getWrapTxs', [
    query('limit')
        .isInt({ min: 0, max: 200 }).optional().withMessage('limit should greater than 0 and less than 200'),
    query('page').isNumeric({ no_symbols: true }).optional().withMessage('page must be number')
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const page = req.query.page >= 1 ? req.query.page - 1 : 0 || 0
        const limit = parseInt(req.query.limit / 2) || 10
        const address = req.query.address || ''
        const coin = req.query.coin || ''

        const url = urljoin(
            config.get('serverAPI'),
            '/transactions',
            `?type=deposit&tomo=${address}&page=${page}&limit=${limit}&coin=${coin}`
        )
        const result = await axios.get(url)
        if (result && result.data) {
            return res.send(result.data)
        }
    } catch (error) {
        return next(error)
    }
})

router.get('/getUnwrapTxs', [
    query('limit')
        .isInt({ min: 0, max: 200 }).optional().withMessage('limit should greater than 0 and less than 200'),
    query('page').isNumeric({ no_symbols: true }).optional().withMessage('page must be number')
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const page = req.query.page >= 1 ? req.query.page - 1 : 0 || 0
        const limit = parseInt(req.query.limit / 2) || 10
        const address = req.query.address || ''
        const coin = req.query.coin || ''

        const url = urljoin(
            config.get('serverAPI'),
            '/transactions',
            `?type=withdraw&tomo=${address}&page=${page}&limit=${limit}&coin=${coin}`
        )
        const result = await axios.get(url)
        if (result && result.data) {
            return res.send(result.data)
        }
    } catch (error) {
        return next(error)
    }
})

module.exports = router
