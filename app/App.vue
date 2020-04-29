<template>
    <div id="app">
        <b-navbar
            v-if="$route.path !== '/' && !$route.params.tokenSymbol"
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
                        <b-nav-item
                            v-if="address"
                            to="/txs/">
                            {{ $t('txHistory') }}<i class="nav-item__icon tb-long-arrow-right" />
                        </b-nav-item>
                        <b-nav-item-dropdown
                            :text="selectedLanguage"
                            class="nav-item--dark">
                            <b-dropdown-item
                                class="current-lang"
                                @click="changeLang('english')">English</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('vietnamese')">Tiếng Việt</b-dropdown-item>
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
        return {
            selectedLanguage: this.$i18n.locale === 'en' ? 'English' : 'Tiếng Việt'
        }
    },
    computed: {
        address: function () {
            return this.$store.state.address
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
    },
    methods: {
        changeLang (lang) {
            switch (lang) {
            case 'english':
                this.$i18n.locale = 'en'
                this.selectedLanguage = 'English'
                break
            case 'vietnamese':
                this.$i18n.locale = 'vi'
                this.selectedLanguage = 'Tiếng Việt'
                break
            default:
                break
            }
        }
    }
}
</script>
