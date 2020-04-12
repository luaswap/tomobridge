<template>
    <b-container class="step-two text-center">
        <i class="tb-search step-two__icon"/>
        <p>
            We are looking for you transaction<br>
            Please stay tuned
        </p>
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
        const parent = this.parent
        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction && data.transaction.InTx) {
                if (data.transaction.InTx.Status === 'BURNED') {
                    parent.toWrapToken.amount = data.transaction.InTx.Amount
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
            const wrapToken = parent.toWrapToken
            const txData = await axios.get(
                `/api/wrap/getTransaction/withdraw/${wrapToken.name}/${address}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        }
    }
}
</script>
