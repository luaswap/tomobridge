<template>
    <div>
        <b-navbar
            toggleable="lg"
            variant="white"
            type="light">
            <b-navbar-brand>Logo here</b-navbar-brand>
            <b-navbar-toggle target="lang-collapse"/>
            <b-collapse
                id="lang-collapse"
                is-nav>
                <b-navbar-nav class="ml-auto navbar-buttons">
                    <b-nav-item>
                        Transaction History -->
                    </b-nav-item>
                    <b-nav-item-dropdown
                        offset="25"
                        right>
                        <template
                            slot="button-content">
                            English
                        </template>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
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
            <WrapStepOne />
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
            step: 3
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: {
    }
}
</script>
