<template>
    <div>
        <section
            id="home-section"
            class="container-fluid">
            <b-row class="align-items-lg-center">
                <welcome />
                <wrap />
            </b-row>
        </section>
        <!-- <section
            id="wrap-section"
            class="container-fluid">
            <WrapHistory />
        </section> -->
    </div>
</template>

<script>
import Web3 from 'web3'
import Welcome from './Welcome'
import Wrap from './Wrap'
import WrapHistory from './WrapHistory'

export default {
    name: 'App',
    components: {
        Welcome,
        Wrap,
        WrapHistory
    },
    data () {
        return { }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        if (window.web3 && window.web3.currentProvider &&
            window.web3.currentProvider.isTomoWallet) {
            const wjs = new Web3(window.web3.currentProvider)
            await this.setupProvider('tomowallet', wjs)
            this.address = await this.getAccount()
            if (this.address) {
                this.$store.state.address = this.address.toLowerCase()
            }
        } else {
            this.address = this.$store.state.address || await this.getAccount()
        }
    },
    methods: { }
}
</script>
