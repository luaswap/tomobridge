<template>
    <b-col
        cols="12"
        lg="7"
        xl="6"
        class="min-vh-100">
        <div class="position-absolute txy-15 bg-white rounded-lg px-3 px-lg-4 px-xl-5 pb-3 pb-xl-4 pt-3">
            <div class="w-100 h-100 position-relative">
                <b-navbar
                    toggleable="md"
                    variant="white"
                    type="light"
                    class="px-0 mb-4">
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
                                <b-dropdown-item
                                    @click="changeLang('chinese')">简体中文</b-dropdown-item>
                                    <!-- <b-dropdown-item
                                    @click="changeLang('vietnamese')">Tiếng Việt</b-dropdown-item> -->
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                    </b-collapse>
                </b-navbar>
                <p class="wrapbox__text">
                    {{ wrapType === 'wrap' ? $t('wrapChooseTokens') : $t('unwrapChooseTokens') }}</p>
                <b-row class="wrapbox__row mb-lg-4">
                    <b-col
                        cols="5">
                        <multiselect
                            id="fromwrap-select"
                            v-model="fromWrapSelected"
                            :options="fromData"
                            :custom-label="customLabel"
                            :show-labels="false"
                            :allow-empty="false"
                            :close-on-select="true"
                            track-by="name"
                            @input="updateBalance"
                            @select="selectAction">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                    || props.option.name === 'BTC' || props.option.name === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick" />
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                    || props.option.name === 'BTC' || props.option.name === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick" />
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
                            :close-on-select="true"
                            track-by="name"
                            @input="updateBalance"
                            @select="selectAction">
                            <template
                                slot="singleLabel"
                                slot-scope="props">
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                    || props.option.name === 'BTC' || props.option.name === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick" />
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0"
                                    class="tb-check-circle-o multiselect_greentick" />
                            </template>
                        </multiselect>
                        <p
                            v-if="toWrapError"
                            style="white-space: nowrap"
                            class="text-error">Please select</p>
                    </b-col>
                </b-row>
                <b-row
                    id="login"
                    class="wrapbox__row mb-lg-4">
                    <b-col>
                        <p
                            v-if="!mobileCheck && !address"
                            class="wrapbox__text">{{ $t('connectOptions') }}</p>
                        <div
                            v-if="!mobileCheck && !address"
                            class="wrapbox__buttons m-0">
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
                            <b-button @click="loginTrust('trezor')">
                                <img
                                    src="/app/assets/images/walletconnect.png"
                                    alt="Trezor">
                                <span>WalletConnect</span>
                            </b-button>
                        </div>
                        <p
                            v-if="address"
                            style="margin-top: 1rem">{{ $t('account') }}: {{ !mobileCheck ? address : truncate(address, 20) }}</p>
                        <p
                            v-if="address && (toWrapSelected || fromWrapSelected)">
                            {{ $t('balance') }}:
                            <strong>
                                {{ balance }} TRC21
                                {{ ((fromWrapSelected || {}).name === 'TRC21') ?
                        (toWrapSelected || {}).name : (fromWrapSelected || {}).name }}</strong></p>
                    </b-col>
                </b-row>
                <div class="text-sm-center">
                    <div
                        v-if="networkWarning"
                        class="text-danger" >{{ networkWarning }}</div>
                    <b-form-checkbox
                        v-model="isAgreed">
                        <p>
                            {{ wrapType === 'wrap' ? $t('wrapAgreement') : $t('unwrapAgreement') }}
                            <a
                                :target="provider === 'tomowallet' ? '' : '_blank'"
                                href="https://docs.tomochain.com/tomobridge/terms-of-use">
                                {{ $t('termsAndConditions') }}</a>
                        </p>
                    </b-form-checkbox>
                    <b-button
                        v-if="wrapType === 'wrap'"
                        :disabled="!isAgreed || !fromWrapSelected || !toWrapSelected || !address"
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="wrapToken">{{ $t('wrapNowBtn') }}</b-button>
                    <b-button
                        v-else
                        :disabled="!isAgreed || !fromWrapSelected || !toWrapSelected || !address"
                        class="wrapbox__big-button btn--big"
                        variant="primary"
                        @click="unWrapToken">
                        {{ $t('unwrapNowBtn') }}</b-button>
                    <p
                        v-if="!mobileCheck && address"
                        class="wrapbox__signout mt-3">
                        <b-button
                            variant="link"
                            class="text-red"
                            @click="signOut">{{ $t('signOutBtn') }}<i class="tb-long-arrow-right" /></b-button>
                    </p>
                </div>
                <div class="position-absolute bottom-0 w-100">
                    <div class="row flex-row-reverse tomo-footer">
                        <div class="col-12 col-xl-4 text-center text-xl-right mb-2 mb-xl-0">
                            <a
                                v-if="!address"
                                href="https://tomob.tomochain.com"
                                class="text-nowrap"
                                target="_blank">Swap TOMO-TOMOB</a>
                        </div>
                        <div class="col-12 col-xl-8">
                            <div class="tomo-meta-links text-center text-xl-left">
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
                                            TRC21 Wrapped Tokens</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Login Modals-->
        <b-modal
            id="privateKeyModal"
            ref="privateKeyModal"
            :title="$t('privateKeyTitle')"
            centered
            scrollable
            hide-footer
            size="md">
            <PrivateKeyModal :parent="this"/>
        </b-modal>

        <b-modal
            id="mnemonicModal"
            ref="mnemonicModal"
            :title="$t('mnemonicTitle')"
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
            :title="$t('hardwareTitle')"
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
            id="tokenWarningModal"
            ref="tokenWarningModal"
            centered
            scrollable
            size="md"
            no-close-on-backdrop
            no-close-on-esc
            hide-footer>
            <template #modal-title>
                Warning
                <i class="tb-warning " />
            </template>
            <TokenWarningModal :parent="this" />
        </b-modal>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-col>
</template>

<script>
import Web3 from 'web3'
import Multiselect from 'vue-multiselect'
import CustomScrollbar from 'vue-custom-scrollbar'
import store from 'store'
import axios from 'axios'
import UnWrap from './UnWrap'
import PrivateKeyModal from './modals/PrivateKeyModal'
import HardwareWalletModal from './modals/HarwareWalletModal'
import MnemonicModal from './modals/MnemonicModal'
import TokenWarningModal from './modals/TokenWarningModal'
// import store from 'store'
import BigNumber from 'bignumber.js'

export default {
    name: 'App',
    components: {
        Multiselect,
        CustomScrollbar,
        UnWrap,
        PrivateKeyModal,
        HardwareWalletModal,
        MnemonicModal,
        TokenWarningModal
    },
    mixins: [],
    data () {
        return {
            fromData: [],
            toData: [],
            selectedLanguage: this.$store.state.language || 'English',
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
            hardwareWallet: '',
            loading: false,
            provider: '',
            networkWarning: '',
            verifiedList: [],
            selectedToken: {}
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
        await self.checkNetwork()
    },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    mounted () {},
    created: async function () {
        this.provider = this.NetworkProvider
        if (this.mobileCheck && window.web3 && window.web3.currentProvider) {
            if (window.web3.currentProvider.isTomoWallet) {
                const wjs = new Web3(window.web3.currentProvider)
                await this.setupProvider('tomowallet', wjs)
            } else {
                const wjs = new Web3(window.web3.currentProvider)
                await this.setupProvider('metamask', wjs)
            }
            this.address = await this.getAccount()
            this.setStorage(
                'account',
                {
                    address: this.address,
                    network: 'tomowallet'
                }
            )
            if (this.address) {
                this.$store.state.address = this.address.toLowerCase()
            }
        } else {
            const storage = this.getStorage('account') || {}
            this.address = storage.address || this.$store.state.address
        }
        this.config = await this.appConfig()
        axios.get(this.config.verifiedListAPI)
            .then(response => {
                if (response.data) {
                    this.verifiedList = response.data
                }
            })
            .catch(error => {
                console.log(error)
            })

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
        this.$bus.$on('walletconnect', () => {
            this.signOut()
        })
        this.checkNetwork()
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
        async unWrapToken () {
            const self = this
            self.checkselectedWrapToken()
            const isWithdrawable = await self.checkWithdrawFee()
            if (self.address && !self.fromWrapError && !self.toWrapError && isWithdrawable) {
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
            this.address = ''
            this.receiveAddress = ''
            this.networkWarning = ''
            const connector = this.walletConnector

            if (connector && connector.connected) {
                connector.killSession()
            }
            this.removeStorage('account')
            store.remove('walletconnect')
            this.$store.replaceState({
                address: null,
                hdPath: '',
                walletConnector: {}
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
        },

        async loginMetamask () {
            try {
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)
                    // const chainId = await wjs.eth.getId()
                    // if (this.config && chainId !== this.config.blockchain.networkId) {
                    //     this.$toasted.show(`${this.$t('wrongChain1')} ${chainId}
                    //     ${this.$t('wrongChain2')} ${this.config.blockchain.networkId}`)
                    // }

                    await this.setupProvider('metamask', wjs)
                    this.address = await this.getAccount()
                    this.setStorage(
                        'account',
                        {
                            address: this.address,
                            network: 'metamask'
                        }
                    )
                    if (this.fromWrapSelected.name !== 'TRC21') {
                        await this.getBalance(this.fromWrapSelected)
                    } else {
                        await this.getBalance(this.toWrapSelected)
                    }
                    if (this.balance === 'NaN') {
                        this.address = ''
                        throw Error('Metamask has to connect to TomoChain network')
                    }
                    this.$store.state.address = this.address.toLowerCase()
                    this.loading = false
                }
            } catch (error) {
                this.loading = false
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
            let contract = new this.web3.eth.Contract(
                this.TomoBridgeTokenAbi.abi,
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
                    this.loading = true
                    const walletProvider = window.tomoWeb3.currentProvider
                    const wjs = new Web3(walletProvider)
                    // const chainId = await wjs.eth.getId()
                    // if (this.config && chainId !== this.config.blockchain.networkId) {
                    //     this.$toasted.show(`${this.$t('wrongChain1')} ${chainId}
                    //     ${this.$t('wrongChain2')} ${this.config.blockchain.networkId}`)
                    // }

                    await this.setupProvider('pantograph', wjs)
                    this.address = await this.getAccount()
                    this.setStorage(
                        'account',
                        {
                            address: this.address,
                            network: 'pantograph'
                        }
                    )
                    if (this.fromWrapSelected.name !== 'TRC21') {
                        await this.getBalance(this.fromWrapSelected)
                    } else {
                        await this.getBalance(this.toWrapSelected)
                    }
                    if (this.balance === 'NaN') {
                        this.address = ''
                        throw Error('Pantograph has to connect to TomoChain network')
                    }
                    this.$store.state.address = this.address.toLowerCase()
                    this.loading = false
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error, { type: 'erroor' })
            }
        },
        async checkWithdrawFee () {
            try {
                if (this.wrapType === 'unwrap') {
                    const { contract } = this.getContract(this.toWrapSelected)

                    const tomoFeeMode = await contract.methods.TOMO_FEE_MODE.call()
                    let withdrawFee, fee

                    if (tomoFeeMode) {
                        withdrawFee = await contract.methods.WITHDRAW_FEE_TOMO().call()
                        fee = new BigNumber(withdrawFee)
                        const userBalance = await this.web3.eth.getBalance(this.address)
                        if (new BigNumber(userBalance).isLessThanOrEqualTo(fee)) {
                            switch (this.$i18n.locale) {
                            case 'en':
                                this.$toasted.show(`Not enough TOMO for withdraw fee(${fee.div(10 ** 18).toString(10)})`)
                                break
                            case 'tr':
                                this.$toasted.show(`Çekim ücreti (${fee.div(10 ** 18).toString(10)}) için yeterli "TOMO" yok.`)
                                break
                            default:
                                break
                            }
                            return false
                        } else {
                            return true
                        }
                    } else {
                        withdrawFee = await contract.methods.WITHDRAW_FEE().call() || 0
                        fee = new BigNumber(withdrawFee).div(10 ** this.toWrapSelected.decimals).toString(10)
                        if (new BigNumber(this.balance).isLessThanOrEqualTo(new BigNumber(fee))) {
                            switch (this.$i18n.locale) {
                            case 'en':
                                this.$toasted.show(`Not enough TRC21 ${this.toWrapSelected.name} for withdraw fee(${fee})`)
                                break
                            case 'tr':
                                this.$toasted.show(`Çekim ücreti (${fee}) için yeterli "TRC21 ${this.toWrapSelected.name}" yok.`)
                                break
                            default:
                                break
                            }
                            return false
                        } else {
                            return true
                        }
                    }
                }
            } catch (error) {
                this.$toasted.show(error, { type: 'error' })
                return false
            }
        },
        async loginTrust () {
            const config = this.config
            const walletProvider = new Web3(new Web3.providers.HttpProvider(config.blockchain.rpc))
            await this.setupProvider('trustwallet', walletProvider)
            this.address = await this.getAccount()
            if (!this.address) {
                const connector = this.walletConnector || store.get('walletconnect')
                if (connector.bridge && !connector.connected) {
                    connector.on('connect', async (error, payload) => {
                        if (error) {
                            this.$toasted.show(error)
                        }
                        const { accounts } = payload.params[0]
                        this.address = accounts[0]
                        this.$store.state.address = this.address.toLowerCase()
                        this.setStorage(
                            'account',
                            {
                                address: this.address,
                                network: 'trustwallet'
                            }
                        )
                        this.connectWallet(connector, this)
                        await this.updateBalance()
                    })
                }
            } else {
                const connector = this.walletConnector || store.get('walletconnect')
                this.$store.state.address = this.address.toLowerCase()
                this.setStorage(
                    'account',
                    {
                        address: this.address,
                        network: 'trustwallet'
                    }
                )
                this.connectWallet(connector, this)
                await this.updateBalance()
            }
        },
        async checkNetwork () {
            if (this.web3) {
                const chainId = await this.web3.eth.getId()
                if (this.config && chainId !== this.config.blockchain.networkId) {
                    this.networkWarning = `${this.$t('wrongChain1')}`
                    // this.networkWarning = `${this.$t('wrongChain1')} ${chainId}
                    //     ${this.$t('wrongChain2')} ${this.config.blockchain.networkId}`
                } else {
                    this.networkWarning = ''
                }
            }
        },
        selectAction (token) {
            if (token.name.toLowerCase() === 'btc' || token.name.toLowerCase() === 'eth') {
                this.selectedToken = token
            } else if (this.verifiedList.indexOf(token.wrapperAddress.toLowerCase()) < 0) {
                setTimeout(() => {
                    this.selectedToken = token
                    this.$refs.tokenWarningModal.show()
                }, 0)
            }
        }
    }
}
</script>
