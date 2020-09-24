<template>
    <div>
        <section
            id="home-section"
            class="container-fluid">
            <b-row class="align-items-lg-center">
                <welcome />
                <wrap />
            </b-row>
        </section>
        <!-- <section
            id="wrap-section"
            class="container-fluid">
            <WrapHistory />
        </section> -->
    </div>
</template>

<script>
import Welcome from './Welcome'
import Wrap from './Wrap'
import WrapHistory from './WrapHistory'

export default {
    name: 'App',
    components: {
        Welcome,
        Wrap,
        WrapHistory
    },
    data () {
        return { }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
    },
    methods: { }
}
</script>
