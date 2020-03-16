<template>
    <div>
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
                    placeholder="Enter Private Key..."
                    type="password"/>
                <div
                    v-if="$v.privateKey.$dirty && !$v.privateKey.required"
                    class="text-error pt-2">Required field</div>
                <b-button
                    id="show-pk-button"
                    @click="showPrivateKey">
                    Show
                    <i class="tb-eye"/>
                </b-button>
            </b-form-group>
            <div class="modal-buttons">
                <b-button @click="closePrivateKeyModal">Cancel</b-button>
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
            privateKey: ''
        }
    },
    validations: {
        privateKey: {
            required
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.config = await this.appConfig()
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
                provider = 'privateKey'
                self.privateKey = self.privateKey.trim()
                walletProvider = new PrivateKeyProvider(self.privateKey, config.blockchain.rpc)

                self.setupProvider(provider, new Web3(walletProvider))
                const address = await self.getAccount()

                if (address) {
                    self.$store.state.address = address.toLowerCase()
                    parent.address = address
                    parent.receiveAddress = address
                    self.closePrivateKeyModal()
                }
            } catch (error) {
                self.$toasted.show(
                    error.message || error, {
                        type : 'error'
                    }
                )
            }
        },
        closePrivateKeyModal () {
            const parent = this.parent
            this.privateKey = ''
            parent.$refs.privateKeyModal.hide()
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
        }
    }
}
</script>
