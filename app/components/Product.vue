<template>
    <div>
        <div class="item-product">
            <div class="box-btn">
                <div
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
                </div>
                <div
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
                </div>
                <div
                    class="row btn-tm">
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
                </div>
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
      nextStep () {}
    }
}
</script>
