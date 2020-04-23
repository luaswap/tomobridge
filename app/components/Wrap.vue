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
                        <b-nav-item
                            v-if="address"
                            to="/txs/">
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
                <p class="wrapbox__text">
                    {{ wrapType === 'wrap' ? 'Wrap' : 'Unwrap' }}
                    your token</p>
                <b-row class="wrapbox__row">
                    <b-col
                        cols="5">
                        <multiselect
                            id="fromwrap-select"
                            v-model="fromWrapSelected"
                            :options="fromData"
                            :custom-label="customLabel"
                            :show-labels="false"
                            :allow-empty="false"
                            track-by="name"
                            @input="updateBalance">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    v-if="props.option.img"
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    v-if="props.option.img"
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                        </multiselect>
                        <p
                            v-if="fromWrapError"
                            style="white-space: nowrap"
                            class="text-error">Please select</p>
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
                            :allow-empty="false"
                            track-by="name"
                            @input="updateBalance">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    v-if="props.option.img"
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    v-if="props.option.img"
                                    :src="props.option.img"
                                    :alt="props.option.name"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                            </template>
                        </multiselect>
                        <p
                            v-if="toWrapError"
                            style="white-space: nowrap"
                            class="text-error">Please select</p>
                    </b-col>
                </b-row>
                <!-- <b-row class="wrapbox__row">
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
                </b-row> -->
                <b-row
                    id="login"
                    class="wrapbox__row">
                    <b-col>
                        <p
                            v-if="!mobileCheck && !address"
                            class="wrapbox__text">Connect with</p>
                        <div
                            v-if="!mobileCheck && !address"
                            class="wrapbox__buttons">
                            <!-- <b-button
                                @click="loginWallet">
                                <img
                                    src="/app/assets/images/tomowallet.svg"
                                    alt="TomoWallet"
                                    style="width: 15px; height: 25px">
                                <span>TomoWallet</span>
                            </b-button> -->
                            <b-button @click="loginPantograph">
                                <img
                                    src="/app/assets/images/pantograph.png"
                                    alt="Private key">
                                <span>Pantograph</span>
                            </b-button>
                            <b-button @click="loginMetamask">
                                <img
                                    src="/app/assets/images/metamask.png"
                                    alt="Private key">
                                <span>Metamask</span>
                            </b-button>
                            <b-button
                                @click="loginHDWallet('ledger')">
                                <img
                                    src="/app/assets/images/ledger.svg"
                                    alt="Ledger">
                                <span>Ledger</span>
                            </b-button>
                            <b-button @click="loginPrivateKey">
                                <img
                                    src="/app/assets/images/key.svg"
                                    alt="Private key">
                                <span>Private key</span>
                            </b-button>
                            <b-button @click="loginMnemonic">
                                <img
                                    src="/app/assets/images/key.svg"
                                    alt="Private key">
                                <span>Mnemonic</span>
                            </b-button>
                            <b-button @click="loginHDWallet('trezor')">
                                <img
                                    src="/app/assets/images/trezorwallet.png"
                                    alt="Trezor">
                                <span>Trezor</span>
                            </b-button>
                        </div>
                        <p
                            v-if="address"
                            style="margin-top: 1rem">Account: {{ !mobileCheck ? address : truncate(address, 20) }}</p>
                        <p
                            v-if="address && (toWrapSelected || fromWrapSelected)">
                            Balance: {{ balance }} TRC21
                            {{ ((fromWrapSelected || {}).name === 'TRC21') ?
                        (toWrapSelected || {}).name : (fromWrapSelected || {}).name }}</p>
                        <p
                            v-if="loginError"
                            class="text-error">Please connect your TOMO wallet</p>
                    </b-col>
                </b-row>
                <div class="text-sm-center">
                    <b-form-checkbox
                        v-model="isAgreed">
                        <p>
                            By {{ (wrapType === 'wrap') ? 'wrapping' : 'unwrapping' }}, you agree to the
                            <a
                                href="https://docs.tomochain.com/legal/terms-of-use"
                                target="_blank">
                                Terms and Conditions</a>
                        </p>
                    </b-form-checkbox>
                    <b-button
                        v-if="wrapType === 'wrap'"
                        :disabled="!isAgreed || !fromWrapSelected || !toWrapSelected || !address"
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="wrapToken">Wrap Now</b-button>
                    <b-button
                        v-else
                        :disabled="!isAgreed || !fromWrapSelected || !toWrapSelected || !address"
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="unWrapToken">
                        UnWrap Now</b-button>
                    <p
                        v-if="address"
                        class="wrapbox__signout mt-3">
                        <b-button
                            variant="link"
                            class="text-red"
                            @click="signOut">Sign Out<i class="tb-long-arrow-right" /></b-button>
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

        <b-modal
            id="mnemonicModal"
            ref="mnemonicModal"
            title="Connect with Mnemonic"
            centered
            scrollable
            hide-footer
            size="md">
            <MnemonicModal :parent="this"/>
        </b-modal>

        <!-- Hardware wallet modal-->
        <b-modal
            id="hdWalletModal"
            ref="hdWalletModal"
            title="Hareware wallet"
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
import Web3 from 'web3'
import Multiselect from 'vue-multiselect'
import CustomScrollbar from 'vue-custom-scrollbar'
import UnWrap from './UnWrap'
import PrivateKeyModal from './modals/PrivateKeyModal'
import HardwareWalletModal from './modals/HarwareWalletModal'
import SelectAddressModal from './modals/SelectAddressModal'
import MnemonicModal from './modals/MnemonicModal'
import store from 'store'
import BigNumber from 'bignumber.js'
import WrapperAbi from '../../abis/WrapperAbi.json'

export default {
    name: 'App',
    components: {
        Multiselect,
        CustomScrollbar,
        UnWrap,
        PrivateKeyModal,
        HardwareWalletModal,
        SelectAddressModal,
        MnemonicModal
    },
    mixins: [],
    data () {
        return {
            fromData: [],
            toData: [],
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
            wrapType: 'wrap',
            fromWrapError: false,
            toWrapError: false,
            balance: 0,
            interval: '',
            hardwareWallet: ''
        }
    },
    computed : {
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
        }
    },
    async updated () {
        const self = this
        if (self.address) {
            self.loginError = false
        }
        if (self.fromWrapSelected !== null) {
            self.fromWrapError = false
        }
        if (self.toWrapSelected !== null) {
            self.toWrapError = false
        }
    },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    mounted () {},
    created: async function () {
        this.address = this.$store.state.address || await this.getAccount()
        this.config = store.get('configBridge') || await this.appConfig()

        this.fromData = this.config.swapCoin || []
        this.toData = this.config.swapToken || []

        if (this.$route.matched[0].path === '/unwrap/:tokenSymbol') {
            this.wrapType = 'unwrap'
            this.toData = this.config.swapCoin || []
            this.fromData = this.config.swapToken || []
            this.toData.forEach(t => {
                if (t.name.toLowerCase() === this.$route.params.tokenSymbol.toLowerCase()) {
                    this.toWrapSelected = t
                }
                this.toWrapSelected = this.toWrapSelected || this.toData[0]
            })
            this.fromWrapSelected = this.fromData[0]
        } else {
            this.toWrapSelected = this.toData[0]
            this.wrapType = 'wrap'
            this.fromData.forEach(t => {
                if (t.name.toLowerCase() === (this.$route.params.tokenSymbol || '').toLowerCase()) {
                    this.fromWrapSelected = t
                }
                this.fromWrapSelected = this.fromWrapSelected || this.fromData[0]
            })
        }

        if (this.address) {
            await this.updateBalance()
        }
    },
    methods: {
        async updateBalance (newValue) {
            let swapCoin = this.config.objSwapCoin
            newValue = this.toWrapSelected
            if (this.toWrapSelected.name === this.config.swapToken[0].name) {
                newValue = this.fromWrapSelected
            }
            let tokenSymbol = ((newValue || {}).name || '').toLowerCase()
            if (this.address &&
                newValue && swapCoin[tokenSymbol]
            ) {
                await this.getBalance(newValue)
                if (this.interval) {
                    clearInterval(this.interval)
                    this.interval = setInterval(async () => {
                        await this.getBalance(newValue)
                    }, 10000)
                } else {
                    this.interval = setInterval(async () => {
                        await this.getBalance(newValue)
                    }, 10000)
                }
            }
        },
        customLabel ({ name }) {
            return `${name}`
        },
        wrapToken () {
            const self = this
            self.checkselectedWrapToken()
            if (self.address && !self.fromWrapError && !self.toWrapError) {
                self.$store.state.fromWrapToken = self.fromWrapSelected
                self.$store.state.toWrapToken = self.toWrapSelected
                self.receiveAddress = self.address
                self.$router.push({
                    name: 'WrapExecution',
                    params: {
                        receiveAddress: self.receiveAddress,
                        fromWrapToken: self.fromWrapSelected,
                        toWrapToken: self.toWrapSelected
                    }
                })
            } else {
                self.loginError = true
            }
        },
        unWrapToken () {
            const self = this
            self.checkselectedWrapToken()
            if (self.address && !self.fromWrapError && !self.toWrapError && self.checkWithdrawFee()) {
                self.$store.state.fromWrapToken = self.fromWrapSelected
                self.$store.state.toWrapToken = self.toWrapSelected
                self.receiveAddress = ''
                this.$refs.unWrapModal.show()
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
            this.wrapType = this.wrapType === 'wrap' ? 'unwrap' : 'wrap'
        },
        async loginPrivateKey () {
            this.$refs.privateKeyModal.show()
        },
        loginHDWallet (wallet) {
            if (wallet === 'trezor') {
                this.hardwareWallet = wallet
            } else {
                this.hardwareWallet = wallet
            }
            this.$refs.hdWalletModal.show()
        },
        loginMnemonic () {
            this.$refs.mnemonicModal.show()
        },
        checkselectedWrapToken () {
            if (this.fromWrapSelected === null) {
                this.fromWrapError = true
            } else { this.fromWrapError = false }
            if (this.toWrapSelected === null) {
                this.toWrapError = true
            } else { this.toWrapError = false }
        },
        signOut () {
            store.clearAll()
            this.address = ''
            this.receiveAddress = ''
            this.$store.replaceState({
                address: null,
                hdPath: ''
            })
        },
        loginWallet () {
            if (this.mobileCheck) {
                window.open(`tomochain://dapp?url=${window.origin}`)
            } else {
                if (confirm('Download TomoWallet to open in app')) {
                    window.open('https://play.google.com/store/apps/details?id=com.tomochain.wallet&hl=en')
                }
            }
        },

        async loginMetamask () {
            try {
                if (window.web3) {
                    const walletProvider = window.web3.currentProvider
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('metamask', wjs)
                    this.address = await this.getAccount()
                    await this.getBalance(this.config.swapCoin[0])
                    if (this.balance === 'NaN') {
                        this.address = ''
                        throw Error('Metamask has to connect to TomoChain network')
                    }
                    this.$store.state.address = this.address.toLowerCase()
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'erroor' })
            }
        },
        convertAmount (id, amount) {
            let decimals = parseInt(this.config.objSwapCoin[id.name.toLowerCase()].decimals)
            return (new BigNumber(amount).div(10 ** decimals)).toString(10)
        },
        getContract (id) {
            let swapCoin = this.config.objSwapCoin
            let tokenSymbol = id.name.toLowerCase()
            let contract = this.web3.eth.Contract(
                WrapperAbi.abi,
                swapCoin[tokenSymbol].wrapperAddress
            )
            return { contract, contractAddress: swapCoin[tokenSymbol].wrapperAddress }
        },
        async getBalance (id) {
            try {
                const { contract } = this.getContract(id)
                if (contract && this.address) {
                    const balance = await contract.methods.balanceOf(this.address).call() || 0
                    this.balance = this.convertAmount(id, balance)
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        async loginPantograph () {
            try {
                if (window.tomoWeb3) {
                    const walletProvider = window.tomoWeb3.currentProvider
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('pantograph', wjs)
                    this.address = await this.getAccount()
                    await this.getBalance(this.config.swapCoin[0])
                    if (this.balance === 'NaN') {
                        this.address = ''
                        throw Error('Pantograph has to connect to TomoChain network')
                    }
                    this.$store.state.address = this.address.toLowerCase()
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'erroor' })
            }
        },
        checkWithdrawFee () {
            try {
                if (this.wrapType === 'unwrap') {
                    const fee = this.config.objSwapCoin[this.toWrapSelected.name.toLowerCase()].withdrawFee
                    if (this.balance < fee) {
                        this.$toasted.show(`Not enough TRC21 ${this.toWrapSelected.name} for withdraw fee(${fee})`)
                        return false
                    } else {
                        return true
                    }
                }
            } catch (error) {
                this.$toasted.show(error, { type: 'error' })
                return false
            }
        }
    }
}
</script>
