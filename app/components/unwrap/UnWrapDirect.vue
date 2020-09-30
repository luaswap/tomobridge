<template>
    <div
        id="unwrapbox"
        class="container mt-5">
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
        <div class="unwrap__info text-center">
            <p>
                {{ $t('unwrapGuide1') + ' ' + toWrapToken.name + ' ' + $t('unwrapGuide2') }}:
            </p>
            <b-row class="wrapbox__row">
                <b-col>
                    <b-form-input
                        id="address-input"
                        v-model="recAddress"
                        :placeholder="$t('unwrapPlaceholder')"/>
                    <p
                        v-if="!isAddress"
                        class="text-error">Invalid {{ toWrapToken.name }} address</p>
                </b-col>
            </b-row>
        </div>
        <div class="unwrap__confirm">
            <p class="unwrap-confirm__title text-danger pb-3">
                {{ $t('unWrapWarningText') }}
            </p>
            <b-button
                :disabled="!recAddress"
                class="unwrap-confirm__button btn--big"
                variant="primary"
                @click="unWrapToken">{{ $t('continueUnwrapBtn') }}</b-button>
        </div>
    </div>
</template>

<script>
import store from 'store'
import Web3 from 'web3'
import axios from 'axios'
import WAValidator from 'wallet-address-validator'
export default {
    name: 'App',
    components: {
    },
    props: { },
    data () {
        return {
            isCheckAddress: false,
            isCheckPrivateKey: false,
            isDoubleCheck: false,
            allChecked: false,
            fromWrapToken: {},
            toWrapToken: {},
            recAddress: this.$route.params.address || '',
            isAddress: true,
            token: this.$route.params.token || '',
            loading: false
        }
    },
    async updated () {
        if (this.isCheckAddress && this.isCheckPrivateKey && this.isDoubleCheck) {
            this.allChecked = true
        } else {
            this.allChecked = false
        }
    },
    beforeDestroy () {
        this.isCheckAddress = false
        this.isCheckPrivateKey = false
        this.isDoubleCheck = false
        this.allChecked = false
    },
    destroyed () { },
    created: async function () {
        this.loading = true
        if (window.web3 && window.web3.currentProvider &&
            window.web3.currentProvider.isTomoWallet) {
            const wjs = new Web3(window.web3.currentProvider)
            await this.setupProvider('tomowallet', wjs)
            this.address = await this.getAccount()
            this.setStorage(
                'account',
                {
                    address: this.address,
                    network: 'tomowallet'
                }
            )
            if (this.address) {
                this.$store.state.address = this.address.toLowerCase()
            }
        }

        if (!this.address) {
            this.loading = false
            this.$router.push('/wrap')
        } else {
            this.config = await this.appConfig()
            const { data } = await axios.get('/api/config/getTokenConfig')
            this.config.swapCoin = data.swapCoin
            this.config.objSwapCoin = data.objSwapCoin
            store.set('configBridge', this.config)

            this.toWrapToken = this.config.objSwapCoin[this.token]
            this.fromWrapToken = this.config.swapToken[0]
            this.loading = false
        }
    },
    methods: {
        unWrapToken () {
            this.isAddress = this.isValidAddresss()
            if (this.isAddress) {
                this.$router.push({
                    name: 'UnWrapExecution',
                    params: {
                        receiveAddress: this.recAddress,
                        fromWrapToken: this.fromWrapToken,
                        toWrapToken: this.toWrapToken
                    }
                })
            }
        },
        isValidAddresss () {
            const address = this.recAddress
            const config = this.config
            // Check network
            const network = config.blockchain.networkId === 88 ? 'prod' : 'testnet'
            switch (this.toWrapToken.network.toLowerCase()) {
            case 'bitcoin':
                return WAValidator.validate(address, 'BTC', network)
            case 'ethereum':
                return this.web3.utils.isAddress(address)
            default:
                return false
            }
        }
    }
}
</script>
