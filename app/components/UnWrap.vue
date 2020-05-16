<template>
    <div id="unwrapbox">
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
            <!-- <p class="text-truncate">
                <a href="#">{{ receiveAddress }}</a>
            </p> -->
        </div>
        <div class="unwrap__confirm">
            <p class="unwrap-confirm__title">
                {{ $t('unwrapConfirm') }}:
            </p>
            <ul class="unwrap-confirm__list">
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckAddress">
                        {{ $t('unwrapConfirm1') + ' ' + toWrapToken.name + ' ' + $t('unwrapConfirm1-2') }}
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckPrivateKey">
                        {{ $t('unwrapConfirm2') + ' ' + toWrapToken.name + ' ' + $t('unwrapConfirm2-2') }}
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isDoubleCheck">
                        {{ $t('unwrapConfirm3') + ' ' + toWrapToken.name + ' ' + $t('unwrapConfirm3-2') }}
                    </b-form-checkbox>
                </li>
            </ul>
            <b-button
                :disabled="!allChecked"
                class="unwrap-confirm__button btn--big"
                variant="primary"
                @click="unWrapToken">Continue to Unwrap</b-button>
        </div>
    </div>
</template>

<script>
import WAValidator from 'wallet-address-validator'
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
            isCheckAddress: false,
            isCheckPrivateKey: false,
            isDoubleCheck: false,
            allChecked: false,
            fromWrapToken: {},
            toWrapToken: {},
            recAddress: '',
            isAddress: true
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
        this.toWrapToken = this.parent.toWrapSelected
    },
    methods: {
        unWrapToken () {
            const parent = this.parent
            this.isAddress = this.isValidAddresss()
            if (parent.address && this.isAddress) {
                parent.receiveAddress = this.recAddress
                this.$router.push({
                    name: 'UnWrapExecution',
                    params: {
                        parent,
                        receiveAddress: this.recAddress,
                        fromWrapToken: this.$store.state.fromWrapToken,
                        toWrapToken: this.$store.state.toWrapToken
                    }
                })
            } else {
                parent.loginError = true
            }
        },
        isValidAddresss () {
            const address = this.recAddress
            const config = this.parent.config
            // Check network
            const network = config.blockchain.networkId === 88 ? 'prod' : 'testnet'
            switch (this.toWrapToken.name.toLowerCase()) {
            case 'btc':
                return WAValidator.validate(address, 'BTC', network)
            case 'eth':
            case 'usdt':
                return this.web3.utils.isAddress(address)
            default:
                return false
            }
        }
    }
}
</script>
