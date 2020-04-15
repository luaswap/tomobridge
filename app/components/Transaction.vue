<template>
    <div>
        <b-container class="txs">
            <h1 class="txs__headline">Transaction history</h1>
            <b-tabs
                no-nav-style>
                <b-tab
                    title="Wrap"
                    active>
                    <b-table
                        :items="wrapItems"
                        :fields="fields"
                        :per-page="wrapPerPage"
                        :class="loading ? 'table--loading' : ''"
                        :show-empty="true"
                        empty-text="There are no transactions to show"
                        stacked="lg"
                        class="txs__table">

                        <template
                            slot="createdAt"
                            slot-scope="data">
                            <span :id="`timestamp__wrap_${data.index}`">{{ data.item.createdAt }}</span>
                            <b-tooltip :target="`timestamp__wrap_${data.index}`">
                                {{ data.item.dateTooltip }}
                            </b-tooltip>
                        </template>

                        <template
                            slot="from"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.from }}</a>
                            </p>
                        </template>

                        <template
                            slot="arrow">
                            <i class="tb-arrow-right"/>
                        </template>

                        <template
                            slot="to"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.to }}</a>
                            </p>
                        </template>

                        <template
                            slot="hash"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.hash }}</a>
                            </p>
                        </template>
                    </b-table>

                    <b-pagination
                        :total-rows="totalWrapRows"
                        :per-page="wrapPerPage"
                        v-model="currentWrapPage"
                        align="center"
                        @change="wrapPageChange" />
                </b-tab>
                <b-tab title="Unwrap">
                    <b-table
                        :items="unwrapItems"
                        :fields="fields"
                        :per-page="UnwrapPerPage"
                        :class="loading ? 'table--loading' : ''"
                        :show-empty="true"
                        empty-text="There are no transactions to show"
                        stacked="lg"
                        class="txs__table">

                        <template
                            slot="createdAt"
                            slot-scope="data">
                            <span :id="`timestamp__unwrap_${data.index}`">{{ data.item.createdAt }}</span>
                            <b-tooltip :target="`timestamp__unwrap_${data.index}`">
                                {{ data.item.dateTooltip }}
                            </b-tooltip>
                        </template>

                        <template
                            slot="from"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.from }}</a>
                            </p>
                        </template>

                        <template
                            slot="to"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.to }}</a>
                            </p>
                        </template>

                        <template
                            slot="hash"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.hash }}</a>
                            </p>
                        </template>
                    </b-table>

                    <b-pagination
                        :total-rows="totalUnwrapRows"
                        :per-page="UnwrapPerPage"
                        v-model="currentUnwrapPage"
                        align="center"
                        @change="unwrapPageChange" />
                </b-tab>
            </b-tabs>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios'
import BigNumber from 'bignumber.js'
import store from 'store'
import moment from 'moment'
export default {
    name: 'App',
    components: { },
    data () {
        return {
            fields: [
                { key: 'hash', label: 'Tx Hash' },
                { key: 'status', label: 'Status' },
                { key: 'token', label: 'Token' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'createdAt', label: 'Age' }
            ],
            txs: [
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    dateTooltip: 'Feb 16, 2020 10:10',
                    createdAt: 'a few seconds ago',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '8 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '8 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '18 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '28 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '38 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                }
            ],
            wrapItems: [],
            unwrapItems: [],
            loading: false,
            totalWrapRows: 10,
            wrapPerPage: 10,
            currentWrapPage: 1,
            totalUnwrapRows: 10,
            UnwrapPerPage: 10,
            currentUnwrapPage: 1,
            tableCssClass: '',
            address: '',
            config: {},
            interval: ''
        }
    },
    async updated () { },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    created: async function () {
        this.config = store.get('configBridge') || await this.appConfig()
        this.address = this.$store.state.address
        if (!this.address) {
            this.$router.push({
                path: '/'
            })
        }

        this.getWrapTxs()
        this.getUnwrapTxs()

        this.interval = setInterval(() => {
            this.getWrapTxs()
            this.getUnwrapTxs()
        }, 5000)
    },
    methods: {
        async getWrapTxs () {
            try {
                const query = {
                    address: this.address,
                    page: this.currentWrapPage,
                    limit: this.wrapPerPage
                }
                const items = []
                const result = await axios.get('/api/transactions/getWrapTxs?' +
                    this.serializeQuery(query))
                if (result && result.data) {
                    this.totalWrapRows = result.data.Total
                    result.data.Data.map(tx => {
                        items.push({
                            hash: tx.InTx.Hash,
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                            status: this.checkStatus(tx.InTx),
                            token: tx.InTx.CoinType,
                            quantity: this.convertAmount(tx.InTx.CoinType, tx.InTx.Amount)
                        })
                        if (tx.OutTx.Hash !== '') {
                            items.push({
                                hash: tx.OutTx.Hash,
                                createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                                dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                                status: tx.OutTx.Status,
                                token: this.changeTokenName(tx.OutTx.CoinType),
                                quantity: this.convertAmount(tx.OutTx.CoinType, tx.OutTx.Amount)
                            })
                        }
                    })
                    this.wrapItems = items
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        async getUnwrapTxs () {
            try {
                const query = {
                    address: this.address,
                    page: this.currentUnwrapPage,
                    limit: this.UnwrapPerPage
                }
                const items = []
                const result = await axios.get('/api/transactions/getUnwrapTxs?' +
                    this.serializeQuery(query))
                if (result && result.data) {
                    this.totalUnwrapRows = result.data.Total
                    result.data.Data.map(tx => {
                        items.push({
                            hash: tx.InTx.Hash,
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                            status: this.checkStatus(tx.InTx),
                            token: this.changeTokenName(tx.InTx.CoinType),
                            quantity: this.convertAmount(tx.InTx.CoinType, tx.InTx.Amount)
                        })
                        if (tx.OutTx.Hash !== '') {
                            items.push({
                                hash: tx.OutTx.Hash,
                                createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                                dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                                status: (tx.OutTx.Status || '').toUpperCase(),
                                token: tx.OutTx.CoinType,
                                quantity: this.convertAmount(tx.OutTx.CoinType, tx.OutTx.Amount)
                            })
                        }
                    })
                    this.unwrapItems = items
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        convertAmount (coin, amount) {
            let result
            switch (coin.toLowerCase()) {
            case 'eth':
            case 'tomoeth':
                result = new BigNumber(amount).div(10 ** 18).toString(10)
                return result
            case 'btc':
            case 'tomobtc':
                result = new BigNumber(amount).div(10 ** 8).toString(10)
                return result
            case 'usdt':
            case 'tomousdt':
                result = new BigNumber(amount).div(10 ** 6).toString(10)
                return result
            default:
                return result
            }
        },
        checkStatus (tx) {
            const wrapTokens = this.config.swapCoin
            if (tx.Status === 'DEPOSITING' || tx.Status === 'WITHDRAWING') {
                for (let i = 0; i < wrapTokens.length; i++) {
                    if (wrapTokens[i].name.toLowerCase() === tx.CoinType.toLowerCase()) {
                        return `${tx.Status}(${tx.Confirmations}/${wrapTokens[i].confirmations})`
                    }
                }
            } else { return tx.Status }
        },
        wrapPageChange (page) {
            this.currentWrapPage = page
            this.getWrapTxs()
        },
        unwrapPageChange (page) {
            this.currentUnwrapPage = page
            this.getUnwrapTxs()
        }
    }
}
</script>
