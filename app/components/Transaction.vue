<template>
    <div>
        <b-container class="txs">
            <h1 class="txs__headline">{{ $t('txHistory') }}</h1>
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
                        :empty-text="$t('emptyText')"
                        stacked="lg"
                        class="txs__table">

                        <template
                            v-slot:cell(createdAt)="data">
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
                            v-slot:cell(inTxHash)="data">
                            <p class="text-truncate">
                                <a
                                    :href="data.item.inTxExplorerUrl"
                                    target="_blank">{{ data.item.inTxHash }}</a>
                            </p>
                        </template>
                        <template
                            v-slot:cell(outTxHash)="data">
                            <p class="text-truncate">
                                <a
                                    :href="data.item.outTxExplorerUrl"
                                    target="_blank">{{ data.item.outTxHash }}</a>
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
                        :empty-text="$t('emptyText')"
                        stacked="lg"
                        class="txs__table">

                        <template
                            v-slot:cell(createdAt)="data">
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
                            v-slot:cell(inTxHash)="data">
                            <p class="text-truncate">
                                <a
                                    :href="data.item.inTxExplorerUrl"
                                    target="_blank">{{ data.item.inTxHash }}</a>
                            </p>
                        </template>
                        <template
                            v-slot:cell(outTxHash)="data">
                            <p class="text-truncate">
                                <a
                                    :href="data.item.outTxExplorerUrl"
                                    target="_blank">{{ data.item.outTxHash }}</a>
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
import urljoin from 'url-join'
export default {
    name: 'App',
    components: { },
    data () {
        return {
            fields: [
                { key: 'inTxHash', label: this.$t('inTxHashLabel') },
                { key: 'outTxHash', label: this.$t('outTxHashLabel') },
                { key: 'status', label: this.$t('statusLabel') },
                { key: 'token', label: this.$t('tokenLabel') },
                { key: 'quantity', label: this.$t('quantityLabel') },
                { key: 'createdAt', label: this.$t('ageLabel') }
            ],
            wrapItems: [],
            unwrapItems: [],
            loading: false,
            totalWrapRows: 10,
            wrapPerPage: 7,
            currentWrapPage: 1,
            totalUnwrapRows: 10,
            UnwrapPerPage: 7,
            currentUnwrapPage: 1,
            tableCssClass: '',
            address: '',
            config: {},
            interval: ''
        }
    },
    async updated () {
        if (this.$i18n.locale === 'cn') {
            moment.locale('zh-cn')
        } else {
            moment.locale(this.$i18n.locale)
        }
    },
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
                            inTxHash: tx.InTx.Hash || '',
                            outTxHash: tx.OutTx.Hash || '',
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                            status: this.checkStatus(tx.InTx) + (tx.OutTx.Status ? `, ${this.$t(tx.OutTx.Status.toLowerCase())}` : ''),
                            token: tx.InTx.CoinType,
                            quantity: this.convertAmount(tx.InTx.CoinType, tx.InTx.Amount),
                            inTxExplorerUrl: this.getTxExplorerUrl(tx.InTx),
                            outTxExplorerUrl: this.getTxExplorerUrl(tx.OutTx)
                        })
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
                            inTxHash: tx.InTx.Hash || '',
                            outTxHash: tx.OutTx.Hash || '',
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt * 1000).format('lll'),
                            status: this.$t(tx.InTx.Status.toLowerCase()) + (tx.OutTx.Status ? `, ${this.checkStatus(tx.OutTx)}` : ''),
                            token: this.changeTokenName(tx.InTx.CoinType),
                            quantity: this.convertAmount(tx.InTx.CoinType, tx.InTx.Amount),
                            inTxExplorerUrl: this.getTxExplorerUrl(tx.InTx),
                            outTxExplorerUrl: this.getTxExplorerUrl(tx.OutTx)
                        })
                    })
                    this.unwrapItems = items
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        convertAmount (coin, amount) {
            let tokenSymbol = coin.toLowerCase()
            if (tokenSymbol.includes('tomo')) {
                tokenSymbol = tokenSymbol.replace('tomo', '')
            }
            if (tokenSymbol) {
                let decimals = parseInt(this.config.objSwapCoin[tokenSymbol].decimals)
                return (new BigNumber(amount).div(10 ** decimals)).toFixed(4).toString(10)
            } else { return '' }
        },
        checkStatus (tx) {
            if (tx.Status === 'DEPOSITING' || tx.Status === 'WITHDRAWING') {
                const coin = this.config.objSwapCoin[tx.CoinType.toLowerCase()]
                // return `${tx.Status}(${tx.Confirmations}/${coin.confirmations})`
                return `${this.$t(tx.Status.toLowerCase())}(${tx.Confirmations}/${coin.confirmations})`
            } else {
                // return tx.Status.toUpperCase()
                return this.$t(tx.Status.toLowerCase()).toUpperCase()
            }
        },
        wrapPageChange (page) {
            this.currentWrapPage = page
            this.getWrapTxs()
        },
        unwrapPageChange (page) {
            this.currentUnwrapPage = page
            this.getUnwrapTxs()
        },
        getTxExplorerUrl (tx) {
            if (tx.CoinType) {
                const coin = this.config.objSwapCoin[tx.CoinType.toLowerCase()]
                if (coin) {
                    if (coin.explorerUrl.includes('tomochain')) {
                        return urljoin(coin.explorerUrl, 'txs', tx.Hash)
                    } else { return urljoin(coin.explorerUrl, 'tx', tx.Hash) }
                }
                return urljoin(this.config.tomoscanUrl, 'txs', tx.Hash)
            }
            return '#'
        },
        changeTokenName (token) {
            return token.replace('TOMO', '')
        }
    }
}
</script>
