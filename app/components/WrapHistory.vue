<template>
    <div
        id="wrap-history"
        class="container">
        <h1 class="wrap-history__headline text-center">{{ $t('wrapHistory') }}</h1>
        <b-row class="wrap-history__row align-items-center justify-content-center">
            <b-col cols="5">
                <multiselect
                    v-model="fromWrapSelected"
                    :options="fromData"
                    :custom-label="customLabel"
                    :show-labels="false"
                    track-by="name"
                    @select="selectCoin">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <img
                            v-if="props.option.img"
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.name }}</span>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            v-if="props.option.img"
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="multiselect__img"><span class="multiselect__name">{{ props.option.name }}</span>
                    </template>
                </multiselect>
            </b-col>
            <b-col cols="1">
                <b-button
                    class="swap-btn">
                    Swap
                    <i class="tb-swap-arrow-right"/>
                    <i class="tb-swap-arrow-left"/>
                </b-button>
            </b-col>
            <b-col cols="5">
                <multiselect
                    v-model="toWrapSelected"
                    :options="toData"
                    :custom-label="customLabel"
                    :show-labels="false"
                    :placeholder="$t('selectOption')"
                    track-by="name">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <img
                            v-if="props.option.img"
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.name }}</span>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            v-if="props.option.img"
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="multiselect__img"><span class="multiselect__name">{{ props.option.name }}</span>
                    </template>
                </multiselect>
            </b-col>
        </b-row>
        <b-row class="wrap-history__row center justify-content-center">
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__wallet text-truncate">
                    <h4 class="wrap-history__title">{{ fromWrapSelected.name }} wallet</h4>
                    <a
                        :href="getAddressUrl(fromWrapSelected.name, fromWrapSelected.mainAddress)"
                        class="wrap-history__address"
                        target="_blank">{{ fromWrapSelected.mainAddress }}</a>
                    <div class="wrap-history__wallet-info">
                        <!-- <p>
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p>
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p> -->
                    </div>
                </div>
            </b-col>
            <b-col
                cols="1"
                class="d-none d-xl-block" />
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__wallet text-truncate">
                    <h4 class="wrap-history__title">
                        Wrapped {{ toWrapSelected.name }} {{ fromWrapSelected.name }} wallet</h4>
                    <a
                        :href="getAddressUrl('TOMO', tokenAddress)"
                        class="wrap-history__address"
                        target="_blank">{{ tokenAddress }}</a>
                    <div class="wrap-history__wallet-info">
                        <!-- <p>
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p>
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p> -->
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row class="wrap-history__row center justify-content-center">
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__txs">
                    <div class="wrap-history__txs-header">
                        <h4 class="wrap-history__title">Transactions</h4>
                        <!-- <a
                            href="#"
                            class="wrap-history__txs-link">View all
                            <i class="tb-long-arrow-right"/>
                        </a> -->
                    </div>
                    <custom-scrollbar
                        id="scroll-left"
                        @ps-scroll-y="scrollLeftHandle">
                        <ul class="wrap-history__txs-list">
                            <li
                                v-for="(item, index) in mainTxs"
                                :key="index"
                                class="wrap-history__txs-item">
                                <p class="wrap-history__tx-row text-truncate">
                                    <span>TX#{{ index }}:</span>
                                    <a
                                        :href="item.explorerUrl"
                                        class="wrap-history__tx-hash"
                                        target="_blank">
                                        {{ item.hash }}
                                    </a>
                                </p>
                                <p class="wrap-history__tx-row text-nowrap">
                                    <span class="wrap-history__tx-from">
                                        <span class="wrap-history__tx-text pr-1">From: </span>
                                        <span
                                            :id="`fromOuter__${index}`"
                                            class="wrap-history__tx-addr">
                                            <span>{{ truncate(item.from, 20) }}</span>
                                            <b-tooltip
                                                :target="`fromOuter__${index}`"
                                                placement="topright">
                                                {{ item.from }}
                                            </b-tooltip>
                                        </span>
                                    </span>
                                    <span
                                        :id="`timestamp__${index}`"
                                        class="wrap-history__tx-date">
                                        {{ item.createdAt }}
                                        <b-tooltip
                                            :target="`timestamp__${index}`"
                                            placement="topright">
                                            {{ item.dateTooltip }}
                                        </b-tooltip>
                                    </span>
                                </p>
                                <p class="wrap-history__tx-row text-nowrap">
                                    <span class="wrap-history__tx-to">
                                        <span class="wrap-history__tx-text pr-1">To: </span>
                                        <span
                                            :id="`toOuter__${index}`"
                                            class="wrap-history__tx-addr">
                                            <span>{{ truncate(item.to, 20) }}</span>
                                            <b-tooltip
                                                :target="`toOuter__${index}`"
                                                placement="topright">
                                                {{ item.to }}
                                            </b-tooltip>
                                        </span>
                                    </span>
                                    <span class="wrap-history__tx-qty">
                                        <i :class="item.type.toLowerCase() === 'withdrawed' ? 'tb-arrow-left' : 'tb-arrow-right'"/>
                                        <!-- <i class="tb-arrow-right"/> -->
                                        {{ item.value }} {{ fromWrapSelected.name }}
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </custom-scrollbar>
                </div>
            </b-col>
            <b-col
                cols="1"
                class="d-none d-xl-block" />
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__txs">
                    <div class="wrap-history__txs-header">
                        <h4 class="wrap-history__title">Transactions</h4>
                        <!-- <a
                            href="#"
                            class="wrap-history__txs-link">View all
                            <i class="tb-long-arrow-right"/>
                        </a> -->
                    </div>
                    <custom-scrollbar
                        id="scroll-right"
                        @ps-scroll-y="scrollRightHandle">
                        <ul
                            class="wrap-history__txs-list">
                            <li
                                v-for="(item, index) in wrapTxs"
                                :key="index"
                                class="wrap-history__txs-item">
                                <p class="wrap-history__tx-row text-truncate">
                                    <span>TX#{{ index }}:</span>
                                    <a
                                        :href="item.explorerUrl"
                                        class="wrap-history__tx-hash"
                                        target="_blank">
                                        {{ item.hash }}
                                    </a>
                                </p>
                                <p class="wrap-history__tx-row text-nowrap">
                                    <span class="wrap-history__tx-from">
                                        <span class="wrap-history__tx-text pr-1">From: </span>
                                        <span
                                            :id="`fromwrap__${index}`"
                                            class="wrap-history__tx-addr">
                                            <span>{{ truncate(item.from, 20) }}</span>
                                            <b-tooltip
                                                :target="`fromwrap__${index}`"
                                                placement="topright">
                                                {{ item.from }}
                                            </b-tooltip>
                                        </span>
                                    </span>
                                    <span
                                        :id="`timestamp__${index}`"
                                        class="wrap-history__tx-date">
                                        {{ item.createdAt }}
                                        <b-tooltip
                                            :target="`timestamp__${index}`"
                                            placement="topright">
                                            {{ item.dateTooltip }}
                                        </b-tooltip>
                                    </span>
                                </p>
                                <p class="wrap-history__tx-row text-nowrap">
                                    <span class="wrap-history__tx-to">
                                        <span class="wrap-history__tx-text pr-1">To: </span>
                                        <span
                                            :id="`towrap__${index}`"
                                            class="wrap-history__tx-addr">
                                            <span>{{ truncate(item.to, 20) }}</span>
                                            <b-tooltip
                                                :target="`towrap__${index}`"
                                                placement="topright">
                                                {{ item.to }}
                                            </b-tooltip>
                                        </span>
                                    </span>
                                    <span class="wrap-history__tx-qty">
                                        <i :class="item.type.toLowerCase() === 'burned' ? 'tb-arrow-left' : 'tb-arrow-right'"/>
                                        <!-- <i class="tb-arrow-right"/> -->
                                        {{ item.value }} {{ toWrapSelected.name }} {{ fromWrapSelected.name }}
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </custom-scrollbar>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import CustomScrollbar from 'vue-custom-scrollbar'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import urljoin from 'url-join'
export default {
    name: 'App',
    components: {
        Multiselect,
        CustomScrollbar
    },
    data () {
        return {
            fromData: [],
            toData: [],
            fromWrapSelected: {
                name: '',
                mainAddress: ''
            },
            toWrapSelected: {
                name: ''
            },
            fromTokens: ['BTC', 'ETH', 'USDT', 'XLM'],
            toTokens: ['TRC20', 'TRC21'],
            mainTxs: [],
            wrapTxs: [],
            config: {}
        }
    },
    computed: {
        tokenAddress: function () {
            if (this.fromWrapSelected) {
                const swapCoin = this.config.swapCoin
                switch (this.fromWrapSelected.name.toLowerCase()) {
                case 'btc':
                    return swapCoin[0].wrapperAddress
                case 'eth':
                    return swapCoin[1].wrapperAddress
                case 'usdt':
                    return swapCoin[2].wrapperAddress
                default:
                    return ''
                }
            }
        }
    },
    watch: {
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.config = await this.appConfig()
        this.fromData = this.config.swapCoin || []
        this.toData = this.config.swapToken || []
        this.fromWrapSelected = this.fromData[0]
        this.toWrapSelected = this.toData[0]

        const response = await this.getTxs(this.fromWrapSelected)
        const result1 = []
        const result2 = []
        if (response && response.data) {
            response.data.mainTxs.map(tx => {
                result1.push({
                    hash: tx.Hash,
                    from: tx.From,
                    to: tx.To,
                    createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                    dateTooltip: moment(tx.CreatedAt).format('lll'),
                    type: tx.Status,
                    value: this.convertAmount(tx.CoinType, tx.Amount),
                    explorerUrl: this.getTxExplorerUrl(tx)
                })
            })
            response.data.wrapTxs.map((tx, index) => {
                if (tx.Status.toLowerCase() === 'burned') {
                    result1[index].type = 'withdrawed'
                }
                result2.push({
                    hash: tx.Hash,
                    from: tx.From,
                    to: tx.To,
                    createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                    dateTooltip: moment(tx.CreatedAt).format('lll'),
                    type: tx.Status,
                    value: this.convertAmount(tx.CoinType, tx.Amount),
                    explorerUrl: this.getTxExplorerUrl(tx)
                })
            })
        }
        this.mainTxs = result1
        this.wrapTxs = result2
    },
    methods: {
        customLabel ({ name }) {
            return `${name}`
        },
        changeWrap () {
            const temp1 = this.fromData
            const temp2 = this.fromWrapSelected

            this.fromData = this.toData
            this.toData = temp1
            this.fromWrapSelected = this.toWrapSelected
            this.toWrapSelected = temp2
        },
        async getTxs (coin) {
            try {
                if (!coin) {
                    coin = {
                        name: 'BTC'
                    }
                }
                const result = await axios.get('/api/transactions?coin=' +
                    coin.name.toLowerCase())
                return result
            } catch (error) {
                this.$toasted.show(error, { type: 'error' })
            }
        },
        async selectCoin (id) {
            try {
                const response = await this.getTxs(id)
                const result1 = []
                const result2 = []
                if (response && response.data) {
                    response.data.mainTxs.map(tx => {
                        result1.push({
                            hash: tx.Hash,
                            from: tx.From,
                            to: tx.To,
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt).format('lll'),
                            type: tx.Status,
                            value: this.convertAmount(tx.CoinType, tx.Amount),
                            explorerUrl: this.getTxExplorerUrl(tx)
                        })
                    })
                    response.data.wrapTxs.map(tx => {
                        result2.push({
                            hash: tx.Hash,
                            from: tx.From,
                            to: tx.To,
                            createdAt: moment(tx.CreatedAt * 1000).fromNow(),
                            dateTooltip: moment(tx.CreatedAt).format('lll'),
                            type: tx.Status,
                            value: this.convertAmount(tx.CoinType, tx.Amount),
                            explorerUrl: this.getTxExplorerUrl(tx)
                        })
                    })
                }
                this.mainTxs = result1
                this.wrapTxs = result2
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        convertAmount (coin, amount) {
            let tokenSymbol

            switch (coin.toLowerCase()) {
            case 'eth':
            case 'tomoeth':
                tokenSymbol = 'eth'
                break
            case 'btc':
            case 'tomobtc':
                tokenSymbol = 'btc'
                break
            case 'usdt':
            case 'tomousdt':
                tokenSymbol = 'usdt'
                break
            }
            if (tokenSymbol) {
                let decimals = parseInt(this.config.objSwapCoin[tokenSymbol].decimals)
                return (new BigNumber(amount).div(10 ** decimals)).toString(10)
            } else { return '' }
        },
        getTxExplorerUrl (tx) {
            if (tx.CoinType) {
                const coin = this.config.objSwapCoin[tx.CoinType.toLowerCase()]
                if (coin) {
                    return urljoin(coin.explorerUrl, 'tx', tx.Hash)
                }
                return urljoin(this.config.tomoscanUrl, 'txs', tx.Hash)
            }
            return '#'
        },
        getAddressUrl (selectedCoin, address) {
            try {
                if (!selectedCoin) {
                    return '#'
                } else if (selectedCoin.toLowerCase().includes('tomo')) {
                    return urljoin(this.config.tomoscanUrl || '', 'address', address)
                } else {
                    const coin = this.config.objSwapCoin[selectedCoin.toLowerCase()]
                    return urljoin(coin.explorerUrl, 'address', address)
                }
            } catch (error) {
                console.log(error)
            }
        },
        scrollLeftHandle (event) {
            console.log(event)
            document.getElementById('scroll-right').scrollTop = document.getElementById('scroll-left').scrollTop
        },
        scrollRightHandle (event) {
            document.getElementById('scroll-left').scrollTop = document.getElementById('scroll-right').scrollTop
        }
    }
}
</script>
