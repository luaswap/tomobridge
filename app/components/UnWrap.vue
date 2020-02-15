<template>
    <div id="unwrapbox">
        <div class="unwrap__info text-center">
            <p>
                You are about to unwrap and then send your BTC to the address
            </p>
            <p class="text-primary">
                0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe
            </p>
        </div>
        <div class="unwrap__confirm">
            <p class="unwrap-confirm__title">
                Please confirm the following:
            </p>
            <ul class="unwrap-confirm__list">
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckAddress">
                        My BTC address has NOT been created on a centrailized exchange (e.g binance.com)
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckPrivateKey">
                        I have a Private Key of BTC address entered above
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isDoubleCheck">
                        I have double checked that BTC address is correct
                    </b-form-checkbox>
                </li>
            </ul>
            <b-button
                :disabled="!allChecked"
                class="unwrap-confirm__button"
                @click="unWrapToken">Continue to Unwrap</b-button>
        </div>
    </div>
</template>

<script>
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
            allChecked: false
        }
    },
    async updated () {
        if (this.isCheckAddress && this.isCheckPrivateKey && this.isDoubleCheck) {
            this.allChecked = true
        }
    },
    beforeDestroy () {
        this.isCheckAddress = false
        this.isCheckPrivateKey = false
        this.isDoubleCheck = false
        this.allChecked = false
    },
    destroyed () { },
    created: async function () { },
    methods: {
        unWrapToken () {
            const parent = this.parent
            if (parent.address) {
                console.log('unwrap')
            } else {
                parent.loginError = true
            }
        }
    }
}
</script>
