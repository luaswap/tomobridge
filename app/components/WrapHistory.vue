<template>
    <div id="wrap-history">
        <h1 class="wrap-history__headline">Wrap history</h1>
        <b-row class="wrap-history__row">
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
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="option__image">
                        <span class="option__name">{{ props.option.name }}</span>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="option__image"><span class="option__name">{{ props.option.name }}</span>
                    </template>
                </multiselect>
            </b-col>
            <b-col cols="2">
                <b-button
                    class="wrap-history__button"
                    @click="changeWrap">
                    Swap
                    <i class="tb-swap-arrow-right"/>
                    <i class="tb-swap-arrow-left"/>
                </b-button>
            </b-col>
            <b-col cols="5">
                <multiselect
                    id="towrap-select"
                    v-model="toWrapSelected"
                    :options="toData"
                    :custom-label="customLabel"
                    :show-labels="false"
                    track-by="name">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <img
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="option__image">
                        <span class="option__name">{{ props.option.name }}</span>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            :src="props.option.img"
                            :alt="props.option.name"
                            class="option__image"><span class="option__name">{{ props.option.name }}</span>
                    </template>
                </multiselect>
            </b-col>
        </b-row>
        <b-row class="wrap-history__row">
            <b-col
                cols="12"
                md="5">
                <div class="wrap-history__wallet">
                    <h4 class="wrap-history__title">ETH wallet</h4>
                    <a
                        href="#"
                        class="wrap-history__address">bnb1s3f8vxaqum3pft6cefyn99px8wq6uk3jdtyarn</a>
                    <div class="wrap-history__wallet-info">
                        <p class="wrap-history__balance">
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p class="wrap-history__txs">
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p>
                    </div>
                </div>
            </b-col>
            <b-col
                cols="2"
                class="d-none d-md-block" />
            <b-col
                cols="12"
                md="5">
                <div class="wrap-history__wallet">
                    <h4 class="wrap-history__title">Wrapped ETH wallet</h4>
                    <a
                        href="#"
                        class="wrap-history__address">bnb1s3f8vxaqum3pft6cefyn99px8wq6uk3jdtyarn</a>
                    <div class="wrap-history__wallet-info">
                        <p class="wrap-history__balance">
                            <i class="tb-wallet"/>
                            <span>Total balance: 234 BTC</span>
                        </p>
                        <p class="wrap-history__txs">
                            <i class="tb-swap"/>
                            <span>Transactions: 10,290 txs</span>
                        </p>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row class="wrap-history__row"/>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
    name: 'App',
    components: {
        Multiselect
    },
    data () {
        return {
            fromData: [
                {
                    name: 'BTC',
                    img: 'app/assets/images/crypto-logos/btc.png'
                },
                {
                    name: 'ETH',
                    img: 'app/assets/images/crypto-logos/eth.png'
                },
                {
                    name: 'USDT',
                    img: 'app/assets/images/crypto-logos/usdt.png'
                },
                {
                    name: 'XLM',
                    img: 'app/assets/images/crypto-logos/xlm.png'
                }
            ],
            toData: [
                {
                    name: 'TRC21',
                    img: 'app/assets/images/crypto-logos/tomo-green.png'
                },
                {
                    name: 'TRC20',
                    img: 'app/assets/images/crypto-logos/tomo-green.png'
                }
            ],
            fromWrapSelected: null,
            toWrapSelected: null
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
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
        }
    }
}
</script>
