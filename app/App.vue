<template>
    <div
        id="app"
        class="bg-body">
        <b-container class="container-medium">
            <div class="open-product text-center">
                <b-navbar-brand
                    class="py-3"
                    to="/">
                    <img
                        class="logo-bri"
                        src="/app/assets/images/logo.svg"
                        alt="TomoBridge" >
                </b-navbar-brand>
                <h3 class="h3 pb-4 mb-2 text-center">
                    Cross-chain portal to transfer assets <br class="d-none d-md-block">between TomoChains and other Blockchains
                </h3>
            </div>
            <router-view />
        </b-container>
        <div class="py-4">
            <b-container>
                <div class="row flex-row-reverse tomo-footer">
                    <div class="col-12">
                        <div class="tomo-meta-links text-center">
                            <ul class="p-0 m-0">
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://forms.gle/cU1XU3b8EUMxB6yA6">
                                        Submit a request</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/faq">
                                        FAQ</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/fee-structure">
                                        Fee Structure</a>
                                </li>
                                <li>
                                    <a
                                        :target="provider === 'tomowallet' ? '' : '_blank'"
                                        href="https://docs.tomochain.com/tomobridge/trc21-wrapped-token-information">
                                        Token Information</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </b-container>
        </div>
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
            case 'chinese':
                this.$i18n.locale = 'cn'
                this.selectedLanguage = '简体中文'
                this.$store.state.language = '简体中文'
                break
            default:
                break
            }
        }
    }
}
</script>
