<template>
    <b-container class="step-one text-center">
        <h3 class="step-one__title">{{ coinName }} receive address</h3>
        <p class="step-one__subtitle">{{ receiveAddress }}</p>
        <div class="step-one__address-box">
            <b-form-input
                v-model="amount"
                placeholder="Enter unwrap amount"
                type="text"/>
        </div>
        <div>
            <p
                v-if="address">
                Balance: {{ balance }} {{ fromWrapToken.name || '' }} {{ toWrapToken.name }}</p>
            <p
                v-if="address">
                Fee: {{ fee }} {{ fromWrapToken.name || '' }} {{ toWrapToken.name }}</p>
        </div>
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">Cancel</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="nextStep">Unwrap</b-button>
        </div>
    </b-container>
</template>

<script>

import VueQrcode from '@chenfengyuan/vue-qrcode'
import BigNumber from 'bignumber.js'
import store from 'store'
import WrapperAbi from '../../../abis/WrapperAbi.json'
export default {
    name: 'App',
    components: {
        VueQrcode
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            coinName: '',
            amount: '',
            gasPrice: 0,
            address: this.$store.state.address || '',
            receiveAddress: this.$route.params.receiveAddress || '',
            fromWrapToken: this.parent.fromWrapToken || {},
            toWrapToken: this.parent.toWrapToken || {},
            config: {},
            balance: 0,
            fee: 0
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.coinName = this.toWrapToken.name
        this.fee = this.toWrapToken.withdrawFee
        this.config = store.get('configBridge') || await this.appConfig() || {}

        this.web3.eth.getGasPrice().then(result => {
            this.gasPrice = result
        }).catch(error => {
            console.log(error)
            this.$toasted.show(error, { type: 'error' })
        })
        await this.getBalance()
    },
    methods: {
        onCopy () {
            this.$toasted.show('Copied!')
        },
        async nextStep () {
            try {
                if (this.amount === '') {
                    this.$toasted.show('Enter unwrap amount')
                } else {
                    const par = this.parent
                    const provider = this.NetworkProvider
                    const chainConfig = this.config.blockchain
                    const nonce = await this.web3.eth.getTransactionCount(this.address)
                    let txParams = {
                        from: this.address,
                        gasPrice: this.web3.utils.toHex(this.gasPrice),
                        gas: this.web3.utils.toHex(chainConfig.gas),
                        gasLimit: this.web3.utils.toHex(chainConfig.gas),
                        nonce: this.web3.utils.toHex(nonce)
                    }
                    const { contract, contractAddress } = this.getContract()
                    if (provider === 'ledger' || provider === 'trezor') {
                        let data = await contract.methods.burn(
                            this.convertWithdrawAmount(this.amount),
                            this.string2byte(this.receiveAddress)
                        ).encodeABI()

                        const dataTx = {
                            data,
                            to: contractAddress
                        }
                        // bypass hardware wallet to sign tx
                        txParams.value = this.web3.utils.toHex(0)

                        Object.assign(
                            dataTx,
                            dataTx,
                            txParams
                        )
                        let signature = await this.signTransaction(dataTx)
                        delete dataTx.value
                        const txHash = await this.sendSignedTransaction(dataTx, signature)
                        if (txHash) {
                            par.transactionHash = txHash
                            let check = true
                            while (check) {
                                const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                if (receipt.status) {
                                    check = false
                                    par.step++
                                } else {
                                    throw new Error('Something went wrong. Please try again')
                                }
                            }
                        }
                    } else {
                        contract.methods.burn(
                            this.convertWithdrawAmount(this.amount),
                            this.string2byte(this.receiveAddress)
                        ).send(txParams)
                            .on('transactionHash', async (txHash) => {
                                par.transactionHash = txHash
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt.status) {
                                        check = false
                                        par.step++
                                    } else {
                                        throw new Error('Something went wrong. Please try again')
                                    }
                                }
                            })
                    }
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        back () {
            this.$router.push({ path: '/' })
        },
        getContract () {
            let id = this.toWrapToken
            let swapCoin = this.config.objSwapCoin
            let tokenSymbol = id.name.toLowerCase()
            let contract = this.web3.eth.Contract(
                WrapperAbi.abi,
                swapCoin[tokenSymbol].wrapperAddress
            )
            return { contract, contractAddress: swapCoin[tokenSymbol].wrapperAddress }
        },
        async getBalance () {
            try {
                if (this.address) {
                    const { contract } = this.getContract()
                    if (contract) {
                        const balance = await contract.methods.balanceOf(this.address).call()
                        this.balance = this.convertAmount(balance)
                    }
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error, { type: 'error' })
            }
        },
        convertWithdrawAmount (amount) {
            let tokenSymbol = this.toWrapToken.name.toLowerCase()

            let decimals = parseInt(this.config.objSwapCoin[tokenSymbol].decimals)
            return (new BigNumber(amount).multipliedBy(10 ** decimals)).toString(10)
        },
        convertAmount (amount) {
            let tokenSymbol = this.toWrapToken.name.toLowerCase()

            let decimals = parseInt(this.config.objSwapCoin[tokenSymbol].decimals)
            return (new BigNumber(amount).div(10 ** decimals)).toString(10)
        }
    }
}
</script>
