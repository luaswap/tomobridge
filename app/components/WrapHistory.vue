<template>
    <div
        id="wrap-history"
        class="container">
        <h1 class="wrap-history__headline text-center">Wrap history</h1>
        <b-row class="wrap-history__row align-items-center">
            <b-col cols="5">
                <multiselect
                    v-model="fromWrapSelected"
                    :options="fromData"
                    :custom-label="customLabel"
                    :show-labels="false"
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
            <b-col cols="2">
                <b-button
                    class="swap-btn"
                    @click="changeWrap">
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
        <b-row class="wrap-history__row">
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__wallet text-truncate">
                    <h4 class="wrap-history__title">ETH wallet</h4>
                    <a
                        href="#"
                        class="wrap-history__address">bnb1s3f8vxaqum3pft6cefyn99px8wq6uk3jdtyarn</a>
                    <div class="wrap-history__wallet-info">
                        <p>
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p>
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p>
                    </div>
                </div>
                <div class="wrap-history__txs">
                    <div class="wrap-history__txs-header">
                        <h4 class="wrap-history__title">Transactions</h4>
                        <a
                            href="#"
                            class="wrap-history__txs-link">View all
                            <i class="tb-long-arrow-right"/>
                        </a>
                    </div>
                    <custom-scrollbar>
                        <ul class="wrap-history__txs-list">
                            <li
                                v-for="(item, index) in wrapTxs"
                                :key="index"
                                class="wrap-history__txs-item">
                                <p class="wrap-history__tx-row text-truncate">
                                    <span>TX#{{ index }}:</span>
                                    <a
                                        href="#"
                                        class="wrap-history__tx-hash">
                                        {{ item.hash }}
                                    </a>
                                </p>
                                <p class="wrap-history__tx-row">
                                    <span class="wrap-history__tx-from">
                                        <span class="wrap-history__tx-text">From: </span>
                                        <span class="wrap-history__tx-addr">
                                            <a href="#">{{ truncate(item.from, 20) }}</a>
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
                                <p class="wrap-history__tx-row">
                                    <span class="wrap-history__tx-to">
                                        <span class="wrap-history__tx-text">To: </span>
                                        <span class="wrap-history__tx-addr">
                                            <a href="#">{{ truncate(item.to, 20) }}</a>
                                        </span>
                                    </span>
                                    <span class="wrap-history__tx-qty">
                                        <i class="tb-arrow-right"/>
                                        5ETH
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </custom-scrollbar>
                </div>
            </b-col>
            <b-col
                cols="2"
                class="d-none d-xl-block" />
            <b-col
                cols="12"
                md="6"
                xl="5">
                <div class="wrap-history__wallet text-truncate">
                    <h4 class="wrap-history__title">Wrapped ETH wallet</h4>
                    <a
                        href="#"
                        class="wrap-history__address">bnb1s3f8vxaqum3pft6cefyn99px8wq6uk3jdtyarn</a>
                    <div class="wrap-history__wallet-info">
                        <p>
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p>
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p>
                    </div>
                </div>

                <div class="wrap-history__txs">
                    <div class="wrap-history__txs-header">
                        <h4 class="wrap-history__title">Transactions</h4>
                        <a
                            href="#"
                            class="wrap-history__txs-link">View all
                            <i class="tb-long-arrow-right"/>
                        </a>
                    </div>
                    <custom-scrollbar>
                        <ul
                            class="wrap-history__txs-list">
                            <li
                                v-for="(item, index) in wrapTxs"
                                :key="index"
                                class="wrap-history__txs-item">
                                <p class="wrap-history__tx-row text-truncate">
                                    <span>TX#{{ index }}:</span>
                                    <a
                                        href="#"
                                        class="wrap-history__tx-hash">
                                        {{ item.hash }}
                                    </a>
                                </p>
                                <p class="wrap-history__tx-row">
                                    <span class="wrap-history__tx-from">
                                        <span class="wrap-history__tx-text">From: </span>
                                        <span class="wrap-history__tx-addr">
                                            <a href="#">{{ truncate(item.from, 20) }}</a>
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
                                <p class="wrap-history__tx-row">
                                    <span class="wrap-history__tx-to">
                                        <span class="wrap-history__tx-text">To: </span>
                                        <span class="wrap-history__tx-addr">
                                            <a href="#">{{ truncate(item.to, 20) }}</a>
                                        </span>
                                    </span>
                                    <span class="wrap-history__tx-qty">
                                        <i class="tb-arrow-right"/>
                                        5ETH
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
            fromWrapSelected: null,
            toWrapSelected: null,
            wrapTxs: [
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'send'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'receive'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'send'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'receive'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'send'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'send'
                },
                {
                    hash: '0cf90s8f90d8f90ds8f90ds8f90sd8f98dsf908ds90f8',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    type: 'send'
                }
            ],
            fromTokens: ['BTC', 'ETH', 'USDT', 'XLM'],
            toTokens: ['TRC20', 'TRC21']
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.config = await this.appConfig() || {}
        this.fromData = this.config.swapCoin || []
        this.toData = this.config.swapToken || []
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
        truncate (fullStr, strLen) {
            if (fullStr.length <= strLen) return fullStr

            const separator = '...'

            let sepLen = separator.length
            let charsToShow = strLen - sepLen
            let frontChars = Math.ceil(charsToShow / 2)
            let backChars = Math.floor(charsToShow / 2)

            return fullStr.substr(0, frontChars) +
               separator +
               fullStr.substr(fullStr.length - backChars)
        }
    }
}
</script>
