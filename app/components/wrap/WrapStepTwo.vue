<template>
    <b-container class="step-two text-center">
        <i class="tb-search step-two__icon"/>
        <p>
            We are looking for your transaction<br>
            Please stay tuned
        </p>
        <div class="step-three__progress">
            <div class="progress-bar">
                <div class="progress-bar__inner">
                    <div
                        :style="`width: ${calculatePercentage(confirmation, requiredConfirm)}%;`"
                        class="progress-bar__bar">
                        <span class="progress-bar__number text-primary">
                            {{ calculatePercentage(confirmation, requiredConfirm) }}%</span>
                    </div>
                </div>
                <span class="progress-bar__total">{{ requiredConfirm }} Confirmation blocks</span>
            </div>
            <!-- <div class="step-three__fee text-primary">
                Fee: 1 TOMO
            </div> -->
        </div>
        <b-button
            class="step-two__button btn--big"
            @click="back">Back</b-button>
    </b-container>
</template>

<script>
import axios from 'axios'
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
            requiredConfirm: 0
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
        this.requiredConfirm = parent.fromWrapToken.confirmations

        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction && data.transaction.InTx &&
                data.transaction.OutTx.Hash === '') {
                const inTx = data.transaction.InTx
                this.confirmation = inTx.Confirmations
                if (this.confirmation >= this.requiredConfirm) {
                    parent.fromWrapToken.amount = data.transaction.InTx.Amount
                    setTimeout(() => {
                        clearInterval(this.interval)
                        parent.step++
                    }, 2000)
                }
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
        }
    }
}
</script>
