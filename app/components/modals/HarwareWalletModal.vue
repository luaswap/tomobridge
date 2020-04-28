<template>
    <div>
        <!-- Select hd path -->
        <div
            v-if="step === 1">
            <b-form-group
                class="mb-4"
                label="Select HD derivation path"
                label-for="hdPath">
                <b-form-input
                    v-model="hdPath"
                    :disabled="type === 'trezor' ? true : false"
                    type="text"
                    placeholder="m/44’/889’/0’/0"/>
                <b-form-text
                    v-if="type === 'ledger'">
                    To unlock the wallet, try paths
                    <span
                        class="hd-path"
                        @click="changePath(`m/44'/60'/0'`)">m/44'/60'/0'</span>
                    or <span
                        class="hd-path"
                        @click="changePath(`m/44'/60'/0'/0`)">m/44'/60'/0'/0</span>
                    with Ethereum App, or try path
                    <span
                        class="hd-path"
                        @click="changePath(`m/44'/889'/0'/0`)">m/44'/889'/0'/0</span>
                    with TomoChain App (on Ledger).
                </b-form-text>
            </b-form-group>
            <div class="modal-buttons">
                <b-button @click="closeModal">Cancel</b-button>
                <b-button
                    variant="primary"
                    @click="unlock">Connect</b-button>
            </div>
        </div>
        <!-- Unlock wallet -->
        <div
            v-if="step === 2"
            id="selectAddressModal">
            <p>Please select the address you would like to interact with</p>
            <custom-scrollbar>
                <ul class="address_list">
                    <li
                        v-for="(wallet, index) in wallets"
                        :key="index"
                        class="address_list__item">
                        <b-form-radio
                            v-model="hdWallet"
                            :value="wallet.address"
                            name="hdWallet">
                            <span class="address_list__address text-truncate text-primary">
                                {{ wallet.address }}
                            </span>
                        </b-form-radio>
                        <span class="address_list__balance">{{ wallet.balance }}</span>
                    </li>
                </ul>
            </custom-scrollbar>
            <p
                id="moreHdAddresses"
                class="text-primary d-inline-block"
                @click="moreHdAddresses">
                More Addresses
            </p>

            <div class="modal-buttons">
                <b-button @click="back">Cancel</b-button>
                <b-button
                    variant="primary"
                    @click="setHdPath">Confirm</b-button>
            </div>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </div>
</template>

<script>
import store from 'store'
import Web3 from 'web3'
import SelectAddressModal from './SelectAddressModal'
import CustomScrollbar from 'vue-custom-scrollbar'

const defaultWalletNumber = 5

export default {
    name: 'App',
    components: {
        SelectAddressModal,
        CustomScrollbar
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            wallets: {},
            hdPath: "m/44'/889'/0'/0",
            step: 1,
            config: {},
            hdWallet: '',
            loading: false,
            hdWallets: [],
            type: ''
        }
    },
    watch: {},
    async updated () {},
    destroyed () {
        this.wallets = {}
    },
    created: async function () {
        this.config = store.get('configBridge') || await this.appConfig()
        this.type = this.parent.hardwareWallet
        if (this.type === 'trezor') {
            this.hdPath = `m/44'/60'/0'/0`
        } else { this.hdPath = `m/44'/889'/0'/0` }
    },
    methods: {
        back () {
            this.step = 1
            this.wallets = {}
        },
        closeModal () {
            const parent = this.parent
            parent.$refs.hdWalletModal.hide()
        },
        changePath (path) {
            this.hdPath = path
        },
        unlock: async function (from, limit = defaultWalletNumber) {
            if (isNaN(from)) { from = 0 }

            const self = this
            let walletList
            self.loading = true
            try {
                store.set('hdDerivationPath', self.hdPath)
                document.body.style.cursor = 'wait'
                if (this.type === 'trezor') {
                    await self.unlockTrezor()
                    walletList = await self.loadTrezorWallets(from, limit)
                } else {
                    await self.unlockLedger()
                    walletList = await self.loadMultipleLedgerWallets(from, limit)
                }

                if (Object.keys(walletList).length > 0) {
                    Object.assign(self.wallets, self.wallets, walletList)
                    document.body.style.cursor = 'default'
                    if (self.step !== 2) {
                        self.step = 2
                    }
                    self.loading = false
                }
            } catch (error) {
                self.loading = false
                self.$toasted.show(error.message || error, {
                    type : 'error'
                })
                document.body.style.cursor = 'default'
            }
        },
        async setHdPath () {
            try {
                this.loading = true
                const parent = this.parent
                document.body.style.cursor = 'wait'
                const offset = document.querySelector('input[name="hdWallet"]:checked').value.toString()
                store.set('hdDerivationPath', this.hdPath + '/' + offset)
                store.set('offset', offset)
                const blockchain = this.config.blockchain
                const walletProvider = new Web3(new Web3.providers.HttpProvider(blockchain.rpc))

                if (this.type === 'trezor') {
                    await this.setupProvider('trezor', walletProvider)
                } else {
                    await this.setupProvider('ledger', walletProvider)
                }
                const address = await this.getAccount()
                parent.address = address
                this.$store.state.address = address.toLowerCase()
                await parent.updateBalance()
                parent.$refs.hdWalletModal.hide()
                this.loading = false
                document.body.style.cursor = 'default'
            } catch (error) {
                this.loading = false
                document.body.style.cursor = 'default'
                self.$toasted.show(error.message || error, {
                    type : 'error'
                })
            }
        },
        async moreHdAddresses () {
            document.getElementById('moreHdAddresses').style.cursor = 'wait'
            document.body.style.cursor = 'wait'
            await this.unlock(Object.keys(this.wallets).length, this.defaultWalletNumber)
            document.body.style.cursor = 'default'
            document.getElementById('moreHdAddresses').style.cursor = 'pointer'
            this.$forceUpdate()
        }
    }
}
</script>
