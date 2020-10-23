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
                    Cross-chain portal to transfer assets <br class="d-none d-md-block">between TomoChain and other Blockchains
                </h3>
            </div>
            <div class="item-product">
                <div class="box-btn">
                    <a
                        class="row btn-tm"
                        @click="redirect('tomoe')">
                        <div class="col-5 px-0 text-right">
                            TOMO<br><span>TomoChain</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5" />
                        </div>
                        <div class="col-5 px-0">
                            TOMOE - ERC20<br><span>Ethereum</span>
                        </div>
                    </a>
                    <a
                        v-if="!mobileCheck"
                        class="row btn-tm"
                        @click="redirect('tomob')">
                        <div class="col-5 px-0 text-right">
                            TOMO<br><span>TomoChain</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5" />
                        </div>
                        <div class="col-5 px-0">
                            TOMOB - BEP2<br><span>Binance Chain</span>
                        </div>
                    </a>
                    <a
                        class="row btn-tm"
                        @click="redirect('sollet')">
                        <div class="col-5 px-0 text-right">
                            LUA & TOMOE - ERC20<br><span>Ethereum</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5" />
                        </div>
                        <div class="col-5 px-0">
                            WRAPPED LUA & TOMOE - SPL<br><span>Solana</span>
                        </div>
                    </a>
                    <a
                        class="row btn-tm"
                        @click="redirect('bridge')">
                        <div class="col-5 px-0 text-right">
                            Tokens<br><span>on other chains</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5" />
                        </div>
                        <div class="col-5 px-0">
                            TRC21 tokens<br><span>on TomoChain</span>
                        </div>
                    </a>
                </div>
                <div>
                    <b-form-checkbox
                        v-model="isAgreed"
                        class="mt-5 text-lg-center">
                        I agree to the
                        <a
                            href="https://docs.tomochain.com/tomobridge/terms-of-use"
                            target="_blank">
                            Terms of Use
                        </a>
                        and the
                        <a
                            href="https://docs.tomochain.com/tomobridge/privacy-policy"
                            target="_blank">
                            Privacy Policy
                        </a>
                    </b-form-checkbox>
                    <p
                        v-if="checkError"
                        class="error my-2">
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
                                        :target="mobileCheck ? '' : '_blank'"
                                        href="https://forms.gle/cU1XU3b8EUMxB6yA6">
                                        Open a Support Ticket</a>
                                </li>
                                <li>
                                    <a
                                        :target="mobileCheck ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/faq">
                                        FAQ</a>
                                </li>
                                <li>
                                    <a
                                        :target="mobileCheck ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/fee-structure">
                                        Fee Structure</a>
                                </li>
                                <li>
                                    <a
                                        :target="mobileCheck ? '' : '_blank'"
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
        return {
            checkError: false,
            isAgreed: false
        }
    },
    computed : {
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
        }
    },
    async updated () { },
    destroyed () {
    },
    created: async function () { },
    methods: {
        redirect (product) {
            if (!this.isAgreed) {
                this.checkError = true
            } else {
                switch (product) {
                case 'bridge':
                    this.$router.push({ path: '/wrap' })
                    break
                case 'tomob':
                    this.isAgreed = false
                    window.location.href = 'https://tomob.tomochain.com'
                    break
                case 'tomoe':
                    this.isAgreed = false
                    window.location.href = 'https://tomoe.tomochain.com'
                    break
                case 'sollet':
                    this.isAgreed = false
                    window.location.href = 'https://www.sollet.io'
                    break
                default:
                    break
                }
            }
        }
    }
}
</script>
