<template>
    <div>
        <b-navbar
            toggleable="md"
            variant="white"
            type="light">
            <div class="container">
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
                        <b-nav-item>
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
            </div>
        </b-navbar>
        <div style="text-align:center">
            <b-row>
                <b-col>
                    <p>
                        Deposit BTC
                    </p>
                </b-col>
                <b-col>
                    <p>
                        VERIFY TRANSACTION
                    </p>
                </b-col>
                <b-col>
                    <p>
                        RECEIVE TRC21 BTC
                    </p>
                </b-col>
            </b-row>
        </div>
        <div v-if="step === 1">
            <WrapStepOne :parent="this"/>
        </div>
        <div v-if="step === 2">
            <WrapStepTwo/>
        </div>
        <div v-if="step === 3">
            <WrapStepThree/>
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
            step: 1
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () { },
    methods: {
    }
}
</script>
