<template>
    <div id="app">
        <b-navbar
            v-if="$route.name === 'WrapExecution' || $route.name === 'UnWrapExecution'"
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
                        <b-nav-item to="/txs/">
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
        <router-view />
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
    created: async function () {
    },
    methods: { }
}
</script>
