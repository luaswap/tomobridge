'use strict'
const express = require('express')
const config = require('config')
const urljoin = require('url-join')
const router = express.Router()
const axios = require('axios')

router.get('/',
    async function (req, res, next) {
        try {
            const page = 0
            const limit = 100
            const coin = req.query.coin || 'btc'
            let response = {
                mainTxs: [],
                wrapTxs: []
            }

            const url = urljoin(
                config.get('serverAPI'),
                '/transactions',
                `?coin=${coin}&page=${page}&limit=${limit}`
            )
            console.log(url)
            const result = await axios.get(url)
            if (result && result.data) {
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

module.exports = router
