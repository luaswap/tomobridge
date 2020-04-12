<template>
    <div id="unwrapbox">
        <div class="unwrap__info text-center">
            <p>
                You are about to unwrap and then send your {{ toWrapToken.name }} to the address:
            </p>
            <b-row class="wrapbox__row">
                <b-col>
                    <b-form-input
                        id="address-input"
                        v-model="recAddress"
                        placeholder="Please your receive address"/>
                </b-col>
            </b-row>
            <!-- <p class="text-truncate">
                <a href="#">{{ receiveAddress }}</a>
            </p> -->
        </div>
        <div class="unwrap__confirm">
            <p class="unwrap-confirm__title">
                Please confirm the following:
            </p>
            <ul class="unwrap-confirm__list">
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckAddress">
                        My {{ toWrapToken.name }}
                        address has NOT been created on a centrailized exchange (e.g binance.com)
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isCheckPrivateKey">
                        I have a Private Key of {{ toWrapToken.name }} address entered above
                    </b-form-checkbox>
                </li>
                <li class="unwrap-confirm__item">
                    <b-form-checkbox
                        v-model="isDoubleCheck">
                        I have double checked that {{ toWrapToken.name }} address is correct
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
            recAddress: ''
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
    created: async function () {
    },
    methods: {
        unWrapToken () {
            const parent = this.parent
            if (parent.address) {
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
        }
    }
}
</script>
