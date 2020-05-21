<template>
    <b-container class="step-two text-center">
        <div v-if="!success">
            <i class="tb-search step-two__icon"/>
            <p>
                {{ $t('lookingTx1') }}<br>
                {{ $t('lookingTx2') }}
            </p>
        </div>
        <div
            v-if="success"
            style="margin-bottom: 30px">
            <h3 class="step-three__title">{{ $t('verifyTx') }}</h3>
            <p>
                {{ $t('txHash2') }}:
                <a
                    :href="getTxExplorerUrl(txHash)"
                    class="step-three__tx-hash-link text-truncate"
                    target="_blank">
                    {{ txHash }}
                </a>
            </p>
        </div>
        <div
            v-if="success">
            <div
                class="step-three__progress">
                <div class="progress-bar">
                    <div class="progress-bar__inner">
                        <div
                            :style="`width: ${calculatePercentage(confirmation, requiredConfirm)}%;`"
                            class="progress-bar__bar">
                            <span class="progress-bar__number text-primary">
                                {{ calculatePercentage(confirmation, requiredConfirm) }}%</span>
                        </div>
                    </div>
                    <span class="progress-bar__total">{{ requiredConfirm }} {{ $t('confirmationBlocks') }}</span>
                </div>
                <!-- <div class="step-three__fee text-primary">
                    Fee: 1 TOMO
                    </div> -->
            </div>
            <span>({{ $t('doneCheckingTx') }}
                <b-link
                    :to="'/txs'">
                    Transaction History
                </b-link>
                )
            </span>
        </div>

        <b-button
            class="step-two__button btn--big"
            @click="back">{{ $t('backBtn') }}</b-button>
    </b-container>
</template>

<script>
import axios from 'axios'
import urljoin from 'url-join'
export default {
    name: 'App',
    components: {
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            interval: '',
            confirmation: 0,
            requiredConfirm: 0,
            success: false,
            txHash: '',
            config: {}
        }
    },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    async updated () { },
    created: async function () {
        const parent = this.parent
        this.config = parent.config
        this.requiredConfirm = parent.fromWrapToken.confirmations

        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction && data.transaction.InTx &&
                data.transaction.OutTx.Hash === '') {
                const inTx = data.transaction.InTx
                this.confirmation = (inTx.Confirmations > 0) ? inTx.Confirmations : 0
                this.txHash = inTx.Hash
                this.success = true
                if (this.confirmation >= this.requiredConfirm) {
                    parent.fromWrapToken.amount = inTx.Amount
                    setTimeout(() => {
                        clearInterval(this.interval)
                        parent.step++
                    }, 2000)
                }
            } else {
                this.success = false
            }
        }, 5000)
    },
    methods: {
        back () {
            const par = this.parent
            par.step--
        },

        async scanTX () {
            const parent = this.parent
            const address = this.$store.state.address || ''
            const wrapToken = parent.fromWrapToken
            const txData = await axios.get(
                `/api/wrap/getTransaction/deposit/${wrapToken.name}/${address}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        },
        calculatePercentage (current, total) {
            if (current >= total) {
                return 100
            } else {
                return Math.floor((current * 100) / total)
            }
        },
        getTxExplorerUrl (txHash) {
            if (txHash) {
                const coin = this.config.objSwapCoin[this.parent.fromWrapToken.name.toLowerCase()]
                if (coin) {
                    return urljoin(coin.explorerUrl, 'tx', txHash)
                }
            }
            return '#'
        }
    }
}
</script>
