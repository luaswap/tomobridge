<template>
    <div class="bg-body">
        <b-container
            class="container-medium">
            <div class="open-product text-center">
                <b-navbar-brand
                    class="py-3"
                    to="/">
                    <img
                        class="logo-bri"
                        src="/app/assets/images/logo.svg"
                        alt="TomoBridge" >
                </b-navbar-brand>
                <h3 class="h3 pb-4 mb-2 text-center">
                    Cross-chain portal to transfer assets <br class="d-none d-md-block">between TomoChains and other Blockchains
                </h3>
            </div>
            <div class="item-product">
                <div class="box-btn">
                    <a
                        href="https://tomob.tomochain.com"
                        class="row btn-tm">
                        <div class="col-5 text-right">
                            Swap TOMO
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="2" />
                        </div>
                        <div class="col-5">
                            Ethereum<br>(TOMOE - ERC20)
                        </div>
                    </a>
                    <a
                        href="https://tomob.tomochain.com"
                        class="row btn-tm">
                        <div class="col-5 text-right">
                            Swap TOMO
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="2" />
                        </div>
                        <div class="col-5">
                            Binance Chain<br>(TOMOB - BEP2)
                        </div>
                    </a>
                    <a
                        class="row btn-tm"
                        @click="abc">
                        <div class="col-5 text-right">
                            Swap Tokens<br>on other chains
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="2" />
                        </div>
                        <div class="col-5">
                            TomoChain<br>Network (TRC21)
                        </div>
                    </a>
                </div>
                <div>
                    <b-form-checkbox class="mt-5">
                        I agree to the
                        <a
                            href="https://docs.tomochain.com/tomobridge/terms-of-use"
                            target="_blank">
                            Terms of Use
                        </a>
                        and the Privacy Policy.
                    </b-form-checkbox>
                    <p class="error my-2">
                        <b-icon
                            class="mr-2 m1 light-h"
                            icon="exclamation-circle"
                            font-scale="1" />Please indicate that you have read and agreed to the Terms of Use and Privacy Policy
                    </p>
                </div>
            </div>
        </b-container>
        <div class="py-4">
            <b-container>
                <div class="row flex-row-reverse tomo-footer">
                    <div class="col-12">
                        <div class="tomo-meta-links text-center">
                            <ul class="p-0 m-0">
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://forms.gle/cU1XU3b8EUMxB6yA6">
                                        Submit a request</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/faq">
                                        FAQ</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/fee-structure">
                                        Fee Structure</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/trc21-wrapped-token-information">
                                        Token Information</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </b-container>
        </div>
    </div>
</template>

<script>

export default {
    name: 'App',
    components: {
    },
    data () {
        return { }
    },
    async updated () { },
    destroyed () { },
    created: async function () {},
    methods: {
      abc () {
        this.$router.push({
          path: '/wrap'
        })
      }
    }
}
</script>
