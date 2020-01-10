<template>
    <div>
        <div style="text-align: center">
            <vue-qrcode
                :options="{ size: 500 }"
                :value="addressQRCode"
                class="img-fluid text-center text-lg-right"/>
        </div>
        <div style="text-align: center">
            {{ depositAddress }}
            <b-button
                v-clipboard:copy="depositAddress"
                v-clipboard:success="onCopy">Copy</b-button>
        </div>
        <div style="text-align:center">
            After you've completed the transfer, click the "NEXT" button so
            we can verify your transaction
        </div>
        <div style="text-align:center">
            <b-button>Cancel</b-button>
            <b-button @click="nextStep">Confirm transaction</b-button>
        </div>
    </div>
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
            addressQRCode: '0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe',
            depositAddress: '0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe'
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: {
        onCopy () {
            this.$toasted.show('Copied!')
        },
        nextStep () {
            const par = this.parent
            par.step++
        }
    }
}
</script>
