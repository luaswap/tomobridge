<template>
    <div>
        <b-navbar
            toggleable="lg"
            variant="white"
            type="light">
            <b-navbar-toggle target="lang-collapse"/>
            <b-collapse
                id="lang-collapse"
                is-nav>
                <b-navbar-nav class="ml-auto navbar-buttons">
                    <b-nav-item>
                        Transaction History -->
                    </b-nav-item>
                    <b-nav-item-dropdown
                        offset="25"
                        right>
                        <template
                            slot="button-content">
                            English
                        </template>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div class="">
            <span>Wrap your token</span>
            <b-row>
                <b-col>
                    <b-form-select
                        v-model="fromWrapSelected"
                        :options="fromData">
                        <template v-slot:first>
                            <option
                                :value="null"
                                disabled>Ê chọn 1 cái coi</option>
                        </template>
                    </b-form-select>
                </b-col>
                <b-col>
                    <b-button @click="changeWrap">Đổi</b-button>
                </b-col>
                <b-col>
                    <b-form-select
                        v-model="toWrapSelected"
                        :options="toData" >
                        <template v-slot:first>
                            <option
                                :value="null"
                                disabled>Ê chọn 1 cái coi</option>
                        </template>
                    </b-form-select>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label for="address-input">{{ toWrapSelected }} receive address</label>
                    <b-form-input
                        id="address-input"
                        v-model="receiveAddress"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label>Connect with</label>
                    <br>
                    <b-button>Tomowallet</b-button>
                    <b-button>Ledger</b-button>
                    <b-button @click="loginPrivateKey">Private key</b-button>
                </b-col>
            </b-row>
            <b-row>
                {{ address }}
                <div v-if="loginError">
                    Please connect your TOMO wallet
                </div>
            </b-row>
            <div style="margin-top: 20px">
                <b-button
                    v-if="wrapType === 'wrap'"
                    :disabled="!isAgreed"
                    @click="wrapToken">Wrap Now</b-button>
                <b-button
                    v-else
                    :disabled="!isAgreed"
                    @click="unWrapToken">
                    UnWrap Now</b-button>
                <b-form-checkbox
                    v-model="isAgreed">
                    By Wrapping, you agree to the
                    <a href="#">Terms and Conditions</a>
                </b-form-checkbox>
            </div>
        </div>

        <!-- Login Modals-->
        <b-modal
            id="privateKeyModal"
            ref="privateKeyModal"
            title="Please select the address you would like to interact with"
            centered
            scrollable
            size="md"
            hide-header
            hide-footer>
            <div>
                <b-form
                    novalidate
                    @submit.prevent="validate()">
                    <b-row>
                        <h2>Connect with Pivate Key</h2>
                    </b-row>
                    <b-row>
                        <label>Private Key</label>
                        <b-form-input
                            id="privateKeyInput"
                            v-model="privateKey"
                            placeholder="Enter private key"
                            type="password"/>
                        <div
                            v-if="$v.privateKey.$dirty && !$v.privateKey.required"
                            class="text-danger pt-2">Required field</div>
                        <b-button @click="showPrivateKey">Show</b-button>
                    </b-row>
                    <div>
                        <b-button @click="closePrivateKeyModal">Cancel</b-button>
                        <b-button type="submit">Confirm</b-button>
                    </div>
                </b-form>
            </div>
        </b-modal>

        <!-- UnWrap Modal-->
        <b-modal
            id="unWrapModal"
            ref="unWrapModal"
            centered
            scrollable
            size="md"
            hide-header
            hide-footer>
            <UnWrap :parent="this" />
        </b-modal>
    </div>
</template>

<script>
// import Web3 from 'web3'
import PrivateKeyProvider from 'truffle-privatekey-provider'
import { validationMixin } from 'vuelidate'
import {
    required
} from 'vuelidate/lib/validators'
import UnWrap from './UnWrap'

export default {
    name: 'App',
    components: {
        UnWrap
    },
    mixins: [validationMixin],
    data () {
        return {
            fromData: ['BTC'],
            toData: ['TRC21'],
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
            const privateKeyField = document.querySelector('#privateKeyInput')
            if (privateKeyField.getAttribute('type') === 'password') {
                privateKeyField.setAttribute('type', 'text')
            } else {
                privateKeyField.setAttribute('type', 'password')
            }
        },
        unWrapToken () {
            console.log(this.wrapType)
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
