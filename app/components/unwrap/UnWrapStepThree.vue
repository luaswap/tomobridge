<template>
    <b-container class="step-three text-center">
        <div v-if="!success">
            <h3 class="step-three__title">We are sending you...</h3>
            <p class="step-three__subtitle">1 BTC to address</p>
            <a
                href="#"
                class="step-three__address">
                {{ address }}
            </a>
            <div class="step-three__progress">
                <div class="progress-bar">
                    <div class="progress-bar__inner">
                        <div
                            class="progress-bar__bar"
                            style="width: 46%;">
                            <span class="progress-bar__number text-primary">46%</span>
                        </div>
                    </div>
                    <span class="progress-bar__total">60 Blocks</span>
                </div>
                <div class="step-three__fee text-primary">
                    Fee: 1 TOMO
                </div>
            </div>
        </div>
        <div
            v-else
            class="step-three__success">
            <i class="tb-check-circle-o step-three__icon text-primary"/>
            <h3 class="step-three__title">You’ve received 1 TRC21-BTC</h3>
        </div>
        <div class="step-three__tx-hash">
            <p>
                Transaction hash:
                <a
                    href="#"
                    class="step-three__tx-hash-link text-truncate">
                    0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbeadasdasdasdas
                </a>
            </p>
        </div>
        <b-button
            v-if="success"
            variant="primary"
            class="step-three__button btn--big">Make another wrap</b-button>
    </b-container>
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
            success: false,
            address: ''
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.address = this.$store.state.address || ''
    },
    methods: {
        /**
         * Note: Add function to update "parent.step" to 4 after wrapping successfully
         * if (success) { parent.step++ }
         */
    }
}
</script>
