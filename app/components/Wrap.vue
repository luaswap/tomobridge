<template>
    <b-col
        cols="12"
        lg="7"
        xl="6"
        class="home-section__col home-section__col--right">
        <div class="home-section__col-inner">
            <b-navbar
                toggleable="md"
                variant="white"
                type="light">
                <b-navbar-brand to="/">
                    <img
                        class="d-lg-none"
                        src="/app/assets/images/logo.svg" >
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
            </b-navbar>
            <div id="wrapbox">
                <p class="wrapbox__text">Wrap your token</p>
                <b-row class="wrapbox__row">
                    <b-col
                        cols="5">
                        <multiselect
                            id="fromwrap-select"
                            v-model="fromWrapSelected"
                            :options="fromData"
                            :custom-label="customLabel"
                            :show-labels="false"
                            track-by="name">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                        </multiselect>
                    </b-col>
                    <b-col
                        cols="2">
                        <b-button
                            class="wrapbox__swap-btn"
                            @click="changeWrap">
                            Swap
                            <i class="tb-swap-arrow-right"/>
                            <i class="tb-swap-arrow-left"/>
                        </b-button>
                    </b-col>
                    <b-col
                        cols="5">
                        <multiselect
                            id="towrap-select"
                            v-model="toWrapSelected"
                            :options="toData"
                            :custom-label="customLabel"
                            :show-labels="false"
                            track-by="name">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                        </multiselect>
                    </b-col>
                </b-row>
                <b-row class="wrapbox__row">
                    <b-col>
                        <label
                            class="wrapbox__text"
                            for="address-input">{{ toWrapSelected ? toWrapSelected.name : '' }} receive address</label>
                        <b-form-input
                            id="address-input"
                            v-model="receiveAddress"
                            placeholder="Please connect your TOMO wallet…"/>
                    </b-col>
                </b-row>
                <b-row class="wrapbox__row">
                    <b-col>
                        <p class="wrapbox__text">Or Connect with</p>
                        <div class="wrapbox__buttons">
                            <b-button>
                                <img
                                    src="app/assets/images/tomowallet.svg"
                                    alt="TomoWallet">
                                <span>TomoWallet</span>
                            </b-button>
                            <b-button>
                                <img
                                    src="app/assets/images/ledger.svg"
                                    alt="Ledger">
                                <span>Ledger</span>
                            </b-button>
                            <b-button @click="loginPrivateKey">
                                <img
                                    src="app/assets/images/key.svg"
                                    alt="Private key">
                                <span>Private key</span>
                            </b-button>
                        </div>
                        {{ address }}
                        <p
                            v-if="loginError"
                            class="text-error">Please connect your TOMO wallet</p>
                    </b-col>
                </b-row>
                <div class="text-sm-center">
                    <b-button
                        v-if="wrapType === 'wrap'"
                        :disabled="!isAgreed"
                        class="wrapbox__big-button"
                        variant="primary"
                        @click="wrapToken">Wrap Now</b-button>
                    <b-button
                        v-else
                        :disabled="!isAgreed"
                        class="wrapbox__big-button"
                        variant="primary"
                        @click="unWrapToken">
                        UnWrap Now</b-button>
                    <b-form-checkbox
                        v-model="isAgreed">
                        By Wrapping, you agree to the <a href="#">Terms and Conditions</a>
                    </b-form-checkbox>
                </div>
            </div>
        </div>

        <!-- Login Modals-->
        <b-modal
            id="privateKeyModal"
            ref="privateKeyModal"
            title="Connect with Private Key"
            centered
            scrollable
            hide-footer
            size="md">
            <b-form
                id="pk-form"
                novalidate
                @submit.prevent="validate()">
                <b-form-group
                    class="pk-form__group"
                    label="Private Key"
                    label-for="pk-input">
                    <b-form-input
                        id="pk-input"
                        v-model="privateKey"
                        placeholder="Enter private key"
                        type="password"/>
                    <div
                        v-if="$v.privateKey.$dirty && !$v.privateKey.required"
                        class="text-danger pt-2">Required field</div>
                    <b-button
                        id="show-pk-button"
                        @click="showPrivateKey">
                        Show
                        <i class="tb-eye"/>
                    </b-button>
                </b-form-group>
                <div class="pk-form__buttons">
                    <b-button @click="closePrivateKeyModal">Cancel</b-button>
                    <b-button type="submit">Confirm</b-button>
                </div>
            </b-form>
        </b-modal>

        <!-- UnWrap Modal-->
        <b-modal
            id="unWrapModal"
            ref="unWrapModal"
            title="UnWrap"
            centered
            scrollable
            size="md"
            hide-footer>
            <UnWrap :parent="this" />
        </b-modal>
    </b-col>
</template>

<script>
// import Web3 from 'web3'
import Multiselect from 'vue-multiselect'
import PrivateKeyProvider from 'truffle-privatekey-provider'
import { validationMixin } from 'vuelidate'
import {
    required
} from 'vuelidate/lib/validators'
import UnWrap from './UnWrap'

export default {
    name: 'App',
    components: {
        Multiselect,
        UnWrap
    },
    mixins: [validationMixin],
    data () {
        return {
            fromData: [
                {
                    name: 'BTC',
                    img: 'app/assets/images/crypto-logos/btc.png'
                },
                {
                    name: 'ETH',
                    img: 'app/assets/images/crypto-logos/eth.png'
                },
                {
                    name: 'USDT',
                    img: 'app/assets/images/crypto-logos/usdt.png'
                },
                {
                    name: 'XLM',
                    img: 'app/assets/images/crypto-logos/xlm.png'
                }
            ],
            toData: [
                {
                    name: 'TRC21',
                    img: 'app/assets/images/crypto-logos/tomo-green.png'
                },
                {
                    name: 'TRC20',
                    img: 'app/assets/images/crypto-logos/tomo-green.png'
                }
            ],
            languages: ['english', 'vietnamese'],
            selectedLanguage: 'english',
            fromWrapSelected: null,
            toWrapSelected: null,
            receiveAddress: '',
            isAgreed: false,
            privateKey: '',
            config: {},
            address: '',
            loginError: false,
            wrapType: 'wrap'
        }
    },
    validations: {
        privateKey: {
            required
        }
    },
    async updated () {
        const self = this
        if (self.address) {
            self.loginError = false
        }
    },
    destroyed () { },
    created: async function () {
        this.config = await this.appConfig()
    },
    methods: {
        customLabel ({ name }) {
            return `${name}`
        },
        validate () {
            const self = this
            self.$v.$touch()
            if (!self.$v.$invalid) {
                self.login('privateKey')
            }
        },
        async login (type) {
            const self = this
            const config = self.config
            let walletProvider
            let provider
            switch (type) {
            case 'privateKey':
                provider = 'privateKey'
                self.privateKey = self.privateKey.trim()
                walletProvider = new PrivateKeyProvider(self.privateKey, config.blockchain.rpc)
            }

            self.setupProvider(provider, walletProvider)
            self.address = await self.getAccount()
            if (self.address) {
                this.closePrivateKeyModal()
            }
        },
        wrapToken () {
            const self = this
            if (self.address) {
                self.$router.push({ path: '/wrapToken' })
            } else {
                self.loginError = true
            }
        },
        changeWrap () {
            const temp1 = this.fromData
            const temp2 = this.fromWrapSelected

            this.fromData = this.toData
            this.toData = temp1
            this.fromWrapSelected = this.toWrapSelected
            this.toWrapSelected = temp2
            console.log(this.wrapType)
            this.wrapType = this.wrapType === 'wrap' ? 'unwrap' : 'wrap'
        },
        loginPrivateKey () {
            this.$refs.privateKeyModal.show()
        },
        closePrivateKeyModal () {
            this.privateKey = ''
            this.$refs.privateKeyModal.hide()
        },
        showPrivateKey () {
            let pkInput = document.querySelector('#pk-input')
            let showPkButton = document.querySelector('#show-pk-button')

            if (pkInput.getAttribute('type') === 'password') {
                pkInput.setAttribute('type', 'text')
                showPkButton.classList.add('active')
            } else {
                pkInput.setAttribute('type', 'password')
                showPkButton.classList.remove('active')
            }
        },
        unWrapToken () {
            console.log(this.wrapType)
            const self = this
            // this.$refs.unWrapModal.show()
            if (self.address) {
                this.$refs.unWrapModal.show()
            } else {
                self.loginError = true
            }
        }
    }
}
</script>
