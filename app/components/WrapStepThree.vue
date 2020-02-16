<template>
    <b-container class="step-three text-center">
        <h3 class="step-three__title">We are sending you...</h3>
        <p class="step-three__subtitle">1 BTC to address</p>
        <a
            href="#"
            class="step-three__address">
            0x33c2E732ae7dce8B05F37B2ba0CFe14c980c4Dbe
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
    </b-container>
</template>

<script>
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: { }
}
</script>
