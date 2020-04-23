<template>
    <div>
        <b-form
            id="pk-form"
            novalidate
            @submit.prevent="validate()">
            <b-form-group
                class="pk-form__group"
                label="Mnemonic"
                label-for="pk-input">
                <b-form-input
                    id="pk-input"
                    v-model="mnemonic"
                    placeholder="Enter Mnemonic..."
                    type="text"/>
                <div
                    v-if="$v.mnemonic.$dirty && !$v.mnemonic.required"
                    class="text-error pt-2">Required field</div>
            </b-form-group>
            <b-form-group
                class="mb-4"
                label="Select HD derivation path"
                label-for="hdPath">
                <b-form-input
                    v-model="hdPath"
                    type="text"
                    placeholder="m/44’/889’/0’/0"/>
                <b-form-text>
                    To unlock the wallet,
                    try paths <span
                        class="hd-path"
                        @click="changePath(`m/44'/60'/0'`)">m/44'/60'/0'</span> or
                    <span
                        class="hd-path"
                        @click="changePath(`m/44'/60'/0'/0`)">m/44'/60'/0'/0</span>
                    for Etherium path or
                    <span
                        class="hd-path"
                        @click="changePath(`m/44'/889'/0'/0`)">m/44'/889'/0'/0</span>
                    for TomoChain path.
                </b-form-text>
            </b-form-group>
            <div class="modal-buttons">
                <b-button @click="closeMnemonicModal">Cancel</b-button>
                <b-button
                    type="submit"
                    variant="primary">Confirm</b-button>
            </div>
        </b-form>
    </div>
</template>

<script>
import Web3 from 'web3'
import PrivateKeyProvider from 'truffle-privatekey-provider'
import { validationMixin } from 'vuelidate'
import {
    required
} from 'vuelidate/lib/validators'
import store from 'store'
import { HDWalletProvider } from '../../../helpers/mnenonic'
export default {
    name: 'App',
    components: { },
    mixins: [validationMixin],
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            hdPath: "m/44'/889'/0'/0", // HD DerivationPath of hardware wallet
            mnemonic: ''
        }
    },
    validations: {
        mnemonic: {
            required
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.config = store.get('configBridge') || await this.appConfig()
    },
    methods: {
        validate () {
            const self = this
            self.$v.$touch()
            if (!self.$v.$invalid) {
                self.login()
            }
        },
        async login () {
            const self = this
            const parent = self.parent
            const config = self.config
            let walletProvider
            let provider
            try {
                provider = 'custom'
                self.mnemonic = self.mnemonic.trim()
                self.mnemonic = self.mnemonic.trim()
                walletProvider = (self.mnemonic.indexOf(' ') >= 0)
                    ? new HDWalletProvider(
                        self.mnemonic,
                        config.blockchain.rpc, 0, 1, self.hdPath)
                    : new PrivateKeyProvider(self.mnemonic, config.blockchain.rpc)

                await self.setupProvider(provider, new Web3(walletProvider))
                const address = await self.getAccount()

                if (address) {
                    self.$store.state.address = address.toLowerCase()
                    parent.address = address
                    await parent.updateBalance()
                    self.closeMnemonicModal()
                }
            } catch (error) {
                self.$toasted.show(
                    error.message || error, {
                        type : 'error'
                    }
                )
            }
        },
        closeMnemonicModal () {
            const parent = this.parent
            this.mnemonic = ''
            parent.$refs.mnemonicModal.hide()
        },
        changePath (path) {
            this.hdPath = path
        }
    }
}
</script>
