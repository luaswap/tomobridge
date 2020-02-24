<template>
    <div id="selectAddressModal">
        <p>Please select the address you would like to interact with</p>
        <custom-scrollbar>
            <ul class="address_list">
                <li
                    v-for="(wallet, index) in wallets"
                    :key="index"
                    class="address_list__item">
                    <b-form-radio
                        v-model="hdWallet"
                        :value="wallet.address"
                        name="hdWallet">
                        <span class="address_list__address text-truncate text-primary">
                            {{ wallet.address }}
                        </span>
                    </b-form-radio>
                    <span class="address_list__balance">{{ wallet.balance }}</span>
                </li>
            </ul>
        </custom-scrollbar>
        <p
            id="moreHdAddresses"
            class="text-primary d-inline-block"
            @click="moreHdAddresses">
            More Addresses
        </p>

        <div class="modal-buttons">
            <b-button @click="closeSelectAdressModal">Cancel</b-button>
            <b-button
                variant="primary"
                @click="setHdPath">Confirm</b-button>
        </div>
    </div>
</template>

<script>
import CustomScrollbar from 'vue-custom-scrollbar'
export default {
    name: 'App',
    components: {
        CustomScrollbar
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            hdWallet: '',
            wallets: [
                {
                    address: '0x7e1e827c7c22834f31075b4530e9e0e2b7815ad8',
                    balance: '97602 TOMO'
                },
                {
                    address: '0x48c4eef517b79ff5259374fed4245359d8fb3ea94',
                    balance: '64530 TOMO'
                },
                {
                    address: '0x1d50df657b6dce50bac634bf18e2d986d807e940',
                    balance: '34355 TOMO'
                },
                {
                    address: '0xad23ed4498de754b60feb3c777472eef3b3a1a38',
                    balance: '18748 TOMO'
                },
                {
                    address: '0x6de605d3582b2723cc66d0da8a4fabf2bba3e29f8',
                    balance: '74365 TOMO'
                }
            ]
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        // if (this.$store.state.wallets) {
        //     this.wallets = this.$store.state.wallets
        // }
        // console.log(this.wallets)
    },
    methods: {
        setHdPath () {
            console.log('set hd path')
            const parent = this.parent
            parent.$refs.selectAddressModal.hide()
        },
        moreHdAddresses () {},
        closeSelectAdressModal () {
            const parent = this.parent
            this.hdWallet = ''
            parent.$refs.selectAddressModal.hide()
        }
    }
}
</script>
