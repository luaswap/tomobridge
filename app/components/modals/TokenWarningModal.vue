<template>
    <div>
        <p class="wrapbox__text">
            {{ $t('tokenWarning') }}
        </p>
        <div class="mt-3">
            <p>${{ token.tokenName }} ({{ token.name }})</p>
            <a
                :href="token.explorerUrl + '/token/' + token.tokenAddress"
                target="_blank">{{ truncate(token.tokenAddress, 32) }} ({{ $t('viewOnEtherscan') }})</a>
            <a
                :href="config.tomoscanUrl + '/tokens/' + token.wrapperAddress"
                class="mt-3"
                target="_blank">{{ truncate(token.wrapperAddress, 32) }} ({{ $t('viewOnTomoscan') }})</a>
        </div>
        <div class="mt-3 w-100">
            <b-form-checkbox
                v-model="check1">
                {{ $t('tokenWarningCheck1') }}
            </b-form-checkbox>
            <b-form-checkbox
                v-model="check2">
                {{ $t('tokenWarningCheck2') }}
            </b-form-checkbox>
        </div>
        <div class="modal-buttons mt-3 justify-content-center">
            <b-button
                :disabled="!check1 || !check2"
                variant="primary"
                @click="confirmToken">Confirm</b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: { },
    mixins: [],
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            check1: false,
            check2: false,
            token: {},
            config: {},
            provider: ''
        }
    },
    validations: { },
    async updated () { },
    destroyed () { },
    created: async function () {
        const parent = this.parent
        this.token = parent.selectedToken
        this.config = parent.config
        this.provider = parent.provider
    },
    methods: {
        confirmToken () {
            const parent = this.parent
            parent.$refs.tokenWarningModal.hide()
        }
    }
}
</script>
