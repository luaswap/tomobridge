<template>
    <div class="tomo-modal-default text-left">
        <h3 class="tmp-title-medium">Wallet Address</h3>
        <div class="tmp-table-two colum-2">
            <table style="display: block">
                <tr
                    v-for="(wallet, index) in wallets"
                    :key="index">
                    <td>
                        <b-form-radio
                            :value="index"
                            name="hdWallet">
                            <span
                                :title="wallet.address">
                                {{ wallet.address }}
                            </span>
                        </b-form-radio>
                    </td>
                    <td><b>{{ wallet.balance }}</b> {{ getCurrencySymbol() }}</td>
                </tr>
            </table>
        </div>
        <div
            id="moreHdAddresses"
            style="margin-top: 10px; cursor: pointer"
            @click="moreHdAddresses">
            More Addresses
        </div>
        <div class="btn-box">
            <b-button
                class="tmp-btn-blue"
                @click="setHdPath">Unlock
            </b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: { },
    props: {
    },
    data () {
        return {
            wallets: {}
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        if (this.$store.state.wallets) {
            this.wallets = this.$store.state.wallets
        }
        console.log(this.wallets)
    },
    methods: {
        setHdPath () {
            console.log('set hd path')
        }
    }
}
</script>
