<template>
    <div>
        <b-navbar
            sticky
            toggleable="md"
            variant="white"
            type="light">
            <b-container>
                <b-navbar-brand to="/">
                    <img
                        src="/app/assets/images/logo.svg"
                        alt="TomoBridge" >
                </b-navbar-brand>
                <b-navbar-toggle target="nav-collapse">
                    <span />
                </b-navbar-toggle>
                <b-collapse
                    id="nav-collapse"
                    is-nav>
                    <b-navbar-nav class="ml-auto navbar-buttons">
                        <b-nav-item to="/txs">
                            Transaction History<i class="nav-item__icon tb-long-arrow-right" />
                        </b-nav-item>
                        <b-nav-item-dropdown
                            class="nav-item--dark"
                            text="English">
                            <b-dropdown-item class="current-lang">English</b-dropdown-item>
                            <b-dropdown-item>Tiếng Việt</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <b-container class="steps">
            <b-row class="align-items-center steps__row">
                <b-col
                    :class="{
                        'steps__col--current' : step === 1,
                        'steps__col--active' : step >= 1,
                    }"
                    class="steps__col">
                    <p class="steps__name">Deposit <br>BTC</p>
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
                    <p class="steps__name">Receive <br>TRC21</p>
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

export default {
    name: 'App',
    components: {
        WrapStepOne,
        WrapStepTwo,
        WrapStepThree
    },
    data () {
        return {
            step: 3
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () { },
    methods: {}
}
</script>
