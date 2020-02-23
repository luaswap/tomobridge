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
            </b-navbar>
            <custom-scrollbar id="wrapbox">
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
                            class="swap-btn"
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
                            for="address-input">{{ toWrapSelected ? toWrapSelected.name : '' }} receive address
                        </label>
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
                            <b-button
                                @click="loginHDWallet">
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
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="wrapToken">Wrap Now</b-button>
                    <b-button
                        v-else
                        :disabled="!isAgreed"
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="unWrapToken">
                        UnWrap Now</b-button>
                    <b-form-checkbox
                        v-model="isAgreed">
                        By Wrapping, you agree to the <a href="#">Terms and Conditions</a>
                    </b-form-checkbox>
                    <p class="wrapbox__signout mt-3">
                        <a
                            href="#"
                            class="text-red">Sign Out<i class="tb-long-arrow-right" /></a>
                    </p>
                </div>
            </custom-scrollbar>
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
            <PrivateKeyModal :parent="this"/>
        </b-modal>

        <!-- Hardware wallet modal-->
        <b-modal
            id="hdWalletModal"
            ref="hdWalletModal"
            title="Ledger"
            centered
            scrollable
            size="md"
            hide-footer>
            <HardwareWalletModal :parent="this" />
        </b-modal>
        <!-- Select -->

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

        <b-modal
            id="selectAddressModal"
            ref="selectAddressModal"
            title="Ledger"
            centered
            scrollable
            size="md"
            hide-footer>
            <SelectAddressModal :parent="this" />
        </b-modal>
    </b-col>
</template>

<script>
// import Web3 from 'web3'
import Multiselect from 'vue-multiselect'
import CustomScrollbar from 'vue-custom-scrollbar'
import { validationMixin } from 'vuelidate'
import {
    required
} from 'vuelidate/lib/validators'
import UnWrap from './UnWrap'
import PrivateKeyModal from './modals/PrivateKeyModal'
import HardwareWalletModal from './modals/HarwareWalletModal'
import SelectAddressModal from './modals/SelectAddressModal'

export default {
    name: 'App',
    components: {
        Multiselect,
        CustomScrollbar,
        UnWrap,
        PrivateKeyModal,
        HardwareWalletModal,
        SelectAddressModal
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
        loginHDWallet () {
            // this.$refs.hdWalletModal.show()
            this.$refs.selectAddressModal.show()
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
            const self = this
            if (self.address) {
                this.$refs.unWrapModal.show()
            } else {
                self.loginError = true
            }
        }
    }
}
</script>
