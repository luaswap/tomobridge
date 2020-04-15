<template>
    <div>
        <b-container class="steps">
            <b-row class="align-items-center steps__row">
                <b-col
                    :class="{
                        'steps__col--current' : step === 1,
                        'steps__col--active' : step >= 1,
                    }"
                    class="steps__col">
                    <p class="steps__name">Wrap {{ fromWrapToken.name || '' }}</p>
                    <p class="steps__number"><span>1</span></p>
                </b-col>
                <b-col
                    :class="{
                        'steps__col--current' : step === 2,
                        'steps__col--active' : step >= 2,
                    }"
                    class="steps__col">
                    <p class="steps__name">Verify Transaction</p>
                    <p class="steps__number"><span>2</span></p>
                </b-col>
                <b-col
                    :class="{
                        'steps__col--current' : step === 3,
                        'steps__col--active' : step >= 3,
                    }"
                    class="steps__col">
                    <p class="steps__name">Receive {{ toWrapToken.name || '' }} {{ fromWrapToken.name || '' }}</p>
                    <p class="steps__number"><span>3</span></p>
                </b-col>
            </b-row>
        </b-container>
        <div v-if="step === 1">
            <WrapStepOne :parent="this"/>
        </div>
        <div v-if="step === 2">
            <WrapStepTwo :parent="this"/>
        </div>
        <div v-if="step === 3">
            <WrapStepThree :parent="this"/>
        </div>
    </div>
</template>

<script>
import WrapStepOne from './WrapStepOne'
import WrapStepTwo from './WrapStepTwo'
import WrapStepThree from './WrapStepThree'
import axios from 'axios'
import store from 'store'

export default {
    name: 'App',
    components: {
        WrapStepOne,
        WrapStepTwo,
        WrapStepThree
    },
    data () {
        return {
            step: 0,
            fromWrapToken: {},
            toWrapToken: {},
            receiveAddress: this.$route.params.receiveAddress || '',
            config: {}
        }
    },
    async updated () {
    },
    destroyed () {
    },
    created: async function () {
        this.config = store.get('configBridge') || await this.appConfig()
        this.fromWrapToken = this.$route.params.fromWrapToken
        this.toWrapToken = this.$route.params.toWrapToken
        if (!this.$store.state.address &&
            !this.fromWrapToken &&
            !this.toWrapToken) {
            this.$router.push({
                path: '/'
            })
        }

        const wrapData = await axios.post(
            '/api/wrap/getAddress',
            {
                wrapCoin: this.fromWrapToken.name,
                receiveAddress: this.receiveAddress
            }
        )
        if (wrapData && wrapData.data) {
            this.fromWrapToken.address = wrapData.data.address
            this.step = 1
        }
    },
    methods: {}
}
</script>
