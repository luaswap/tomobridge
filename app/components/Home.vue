<template>
    <div>
        <section
            id="home-section"
            class="container-fluid">
            <b-row class="align-items-md-center h-100">
                <welcome />
                <wrap />
            </b-row>
        </section>
        <section
            id="wrap-section"
            class="container-fluid">
            <b-row id="wrap-history">
                <b-col>
                    <transaction />
                </b-col>
            </b-row>
        </section>
    </div>
</template>

<script>
import Welcome from './Welcome'
import Wrap from './Wrap'
import Transaction from './Transaction'
export default {
    name: 'App',
    components: {
        Welcome,
        Wrap,
        Transaction
    },
    data () {
        return { }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: { }
}
</script>
