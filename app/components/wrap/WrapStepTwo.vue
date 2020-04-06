<template>
    <b-container class="step-two text-center">
        <i class="tb-search step-two__icon"/>
        <p>
            We are looking for your transaction<br>
            Please stay tuned
        </p>
        <b-button
            class="step-two__button btn--big"
            @click="back">Back</b-button>
    </b-container>
</template>

<script>
import axios from 'axios'
import BigNumber from 'bignumber.js'
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
            interval: ''
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
        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction && data.transaction.InTx && data.transaction.OutTx.Hash === '') {
                if (data.transaction.InTx.Confirmations > 0) {
                    if (parent.fromWrapToken.name.toLowerCase() === 'btc') {
                        parent.fromWrapToken.amount =
                            new BigNumber(data.transaction.InTx.Amount).multipliedBy(10 ** 8).toString(10)
                    } else {
                        parent.fromWrapToken.amount = data.transaction.InTx.Amount
                    }
                    clearInterval(this.interval)
                    parent.step++
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
        }
    }
}
</script>
