<template>
    <div>
        <b-row style="height:100vh">
            <b-col style="background-color: #1d1e31">
                <welcome />
            </b-col>
            <b-col>
                <wrap />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <Transaction />
            </b-col>
        </b-row>
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
