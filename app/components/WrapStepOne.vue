<template>
    <b-container class="step-one text-center">
        <h3 class="step-one__title">Here’s what you need to do next:</h3>
        <p class="step-one__subtitle">Send BTC to the public address below</p>
        <vue-qrcode
            :options="{ width: 200, color: { light: '#f6f7fa' } }"
            :value="addressQRCode"
            class="step-one__qr"/>
        <div class="step-one__address-box">
            <a
                class="step-one__address"
                href="#">{{ depositAddress }}</a>
            <b-button
                v-clipboard:copy="depositAddress"
                v-clipboard:success="onCopy"
                variant="primary"
                class="step-one__copy"><i class="tb-copy"/> Copy</b-button>
        </div>
        <p class="step-one__subtitle">
            After you've completed the transfer, click the "NEXT" button so
            we can verify your transaction
        </p>
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">Cancel</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="nextStep">Confirm transaction</b-button>
        </div>
    </b-container>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
export default {
    name: 'App',
    components: {
        VueQrcode
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            addressQRCode: '',
            depositAddress: ''
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        const swapCoin = this.parent.fromWrapToken
        this.depositAddress = swapCoin.address
        this.addressQRCode = swapCoin.address
    },
    methods: {
        onCopy () {
            this.$toasted.show('Copied!')
        },
        nextStep () {
            const par = this.parent
            par.step++
        },
        back () {
            this.$router.push({ path: '/' })
        }
    }
}
</script>
