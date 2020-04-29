<template>
    <b-col
        cols="12"
        lg="5"
        xl="6"
        class="text-center d-none d-lg-block home-section__col home-section__col--left">
        <img
            class="home-section__logo"
            src="/app/assets/images/logo-pc.svg" >
        <h1 class="home-section__headline">TomoBridge</h1>
        <div class="home-section__title">{{ $t('welcomeTitle1') }}</div>
        <div class="home-section__subtitle">{{ $t('welcomeTitle2') }}</div>
    </b-col>
</template>

<script>
export default {
    name: 'App',
    components: { },
    data () {
        return { }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: { }
}
</script>
