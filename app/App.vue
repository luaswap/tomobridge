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
                                @click="changeLang('turkish')">Türk</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('japanese')">日本語</b-dropdown-item>
                                <!-- <b-dropdown-item
                                @click="changeLang('vietnamese')">Tiếng Việt</b-dropdown-item> -->
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
            selectedLanguage: this.$store.state.language || 'English',
            address: ''
        }
    },
    computed: {
    },
    async updated () {
        this.selectedLanguage = this.$store.state.language || 'English'
        this.address = this.$store.state.address
    },
    destroyed () { },
    created: async function () {
        const storage = this.getStorage('account') || {}
        this.address = storage.address || this.$store.state.address || await this.getAccount()
        if (this.address) {
            this.NetworkProvider = storage.network
            this.$store.state.address = this.address
        }
    },
    methods: {
        changeLang (lang) {
            switch (lang) {
            case 'english':
                this.$i18n.locale = 'en'
                this.selectedLanguage = 'English'
                this.$store.state.language = 'English'
                break
            case 'vietnamese':
                this.$i18n.locale = 'vi'
                this.selectedLanguage = 'Tiếng Việt'
                this.$store.state.language = 'Tiếng Việt'
                break
            case 'turkish':
                this.$i18n.locale = 'tr'
                this.selectedLanguage = 'Türk'
                this.$store.state.language = 'Türk'
                break
            case 'japanese':
                this.$i18n.locale = 'ja'
                this.selectedLanguage = '日本語'
                this.$store.state.language = '日本語'
                break
            default:
                break
            }
        }
    }
}
</script>
