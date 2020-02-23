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
                    type="text"
                    placeholder="m/44’/889’/0’/0"/>
                <b-form-text>
                    To unlock the wallet, try paths
                    <span
                        class="hd-path"
                        style="cursor: pointer"
                        @click="changePath(`m/44'/60'/0'`)">m/44'/60'/0'</span>
                    or <span
                        class="hd-path"
                        style="cursor: pointer"
                        @click="changePath(`m/44'/60'/0'/0`)">m/44'/60'/0'/0</span>
                    with Ethereum App, or try path
                    <span
                        class="hd-path"
                        style="cursor: pointer"
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
            class="tomo-modal-default text-left">
            <h3 class="tmp-title-medium">Wallet Address</h3>
            <div class="tmp-table-two colum-2">
                <table style="display: block">
                    <tr
                        v-for="(wallet, index) in wallets"
                        :key="index">
                        <td>
                            <b-form-radio
                                :value="index"
                                name="hdWallet">
                                <span
                                    :title="wallet.address">
                                    {{ wallet.address }}
                                </span>
                            </b-form-radio>
                        </td>
                        <td><b>{{ wallet.balance }}</b> {{ getCurrencySymbol() }}</td>
                    </tr>
                </table>
            </div>
            <div
                id="moreHdAddresses"
                style="margin-top: 10px; cursor: pointer"
                @click="moreHdAddresses">
                More Addresses
            </div>
            <div class="modal-buttons">
                <b-button @click="back">Back</b-button>
                <b-button
                    variant="primary"
                    @click="setHdPath">Unlock</b-button>
            </div>
        </div>
    </div>
</template>

<script>
import store from 'store'
import Web3 from 'web3'

const defaultWalletNumber = 10

export default {
    name: 'App',
    components: {
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
            hdPath: 'm/44’/889’/0’/0',
            step: 1,
            config: {}
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.config = store.get('config') || await this.appConfig()
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
            if (isNaN(from)) {
                from = 0
            }
            const self = this
            let wallets
            try {
                store.set('hdDerivationPath', self.hdPath)
                document.body.style.cursor = 'wait'
                await self.unlockLedger(self.hdPath)
                wallets = await self.loadMultipleLedgerWallets(from, limit)
                if (Object.keys(wallets).length > 0) {
                    Object.assign(self.wallets, self.wallets, wallets)
                    // document.getElementById('hdwalletModal').style.display = 'block'
                    // this.$refs.hdwalletModal.show()
                    // self.loading = false
                }
                document.body.style.cursor = 'default'
                self.wallets = wallets
                self.step = 2
            } catch (error) {
                self.$toasted.show(error.message || error, {
                    type : 'error'
                })
            }
        },
        async setHdPath () {
            const parent = this.parent
            const offset = document.querySelector('input[name="hdWallet"]:checked').value.toString()
            store.set('hdDerivationPath', self.hdPath + '/' + offset)
            store.set('offset', offset)
            const blockchain = self.config
            const walletProvider = new Web3(new Web3.providers.HttpProvider(blockchain.rpc))
            await this.setupProvider('ledger', walletProvider)
            parent.$refs.hdWalletModal.hide()
        }
    }
}
</script>
