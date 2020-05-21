<template>
    <b-container class="step-one text-center">
        <h3 class="step-one__title">{{ $t('wrapGuide1') }}:</h3>
        <p class="step-one__subtitle">{{ $t('sendToAddress1') + ` ${tokenName} ` + $t('sendToAddress2') }}</p>
        <div>
            <label class="step-one__warning">
                {{ $t('wrapWarning') }} {{ minimumDeposit }} {{ tokenName }}
            </label>
            <i
                id="warning"
                class="tb-info mb-2" />
            <b-tooltip
                target="warning">
                {{ $t('wranningTooltip') }} {{ tokenName }}
            </b-tooltip>
        </div>
        <vue-qrcode
            :options="{ width: 200, color: { light: '#f6f7fa' } }"
            :value="addressQRCode"
            class="step-one__qr"/>
        <div class="step-one__address-box">
            <a
                :href="getAddressUrl()"
                class="step-one__address text-break"
                target="_blank">{{ depositAddress }}</a>
            <b-button
                v-clipboard:copy="depositAddress"
                v-clipboard:success="onCopy"
                variant="primary"
                class="step-one__copy"><i class="tb-copy"/>{{ $t('copyBtn') }}</b-button>
        </div>
        <p class="step-one__subtitle">
            {{ $t('wrapConfirm') }}
        </p>
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">{{ $t('cancelBtn') }}</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="nextStep">{{ $t('confirmTransaction') }}</b-button>
        </div>
    </b-container>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import urljoin from 'url-join'
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
            depositAddress: '',
            tokenName: '',
            fromToken: {},
            config: {},
            minimumDeposit: 0
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.fromToken = this.parent.fromWrapToken
        this.depositAddress = this.fromToken.address
        this.addressQRCode = this.fromToken.address
        this.tokenName = this.fromToken.name
        this.config = this.parent.config
        this.minimumDeposit = this.config.objSwapCoin[this.tokenName.toLowerCase()].minimumWithdrawal
    },
    methods: {
        onCopy () {
            this.$toasted.show('Copied!', { type: 'success' })
        },
        nextStep () {
            const par = this.parent
            par.step++
        },
        back () {
            this.$router.push({ path: '/' })
        },
        getAddressUrl () {
            try {
                if (this.tokenName) {
                    const coin = this.config.objSwapCoin[this.tokenName.toLowerCase()]

                    return urljoin(coin.explorerUrl, 'address', this.depositAddress)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
