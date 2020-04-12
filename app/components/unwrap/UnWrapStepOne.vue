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
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">Cancel</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="nextStep">Confirm transaction</b-button>
        </div>
    </b-container>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import BigNumber from 'bignumber.js'
import store from 'store'
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
            config: {}
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.coinName = this.toWrapToken.name
        this.config = store.get('configBridge') || await this.appConfig() || {}

        this.web3.eth.getGasPrice().then(result => {
            this.gasPrice = result
        }).catch(error => {
            console.log(error)
            this.$toasted.show(error, { type: 'error' })
        })
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
                        nonce
                    }
                    const { contract, contractAddress } = this.getContract()
                    if (provider === 'ledger') {
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
                            this.transactionHash = txHash
                            let check = true
                            while (check) {
                                const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                if (receipt) {
                                    check = false
                                    par.step++
                                }
                            }
                        }
                    } else {
                        contract.methods.burn(
                            this.convertWithdrawAmount(this.amount),
                            this.string2byte(this.receiveAddress)
                        ).send(txParams)
                            .on('transactionHash', async (txHash) => {
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt) {
                                        check = false
                                        par.step++
                                    }
                                }
                            })
                    }
                }
            } catch (error) {
                this.$toasted.show(error, { type: 'error' })
            }
        },
        back () {
            this.$router.push({ path: '/' })
        },
        getContract () {
            let contract
            const blockchain = this.config.blockchain
            switch (this.toWrapToken.name.toLowerCase()) {
            case 'eth':
                contract = this.ethContract
                return { contract, contractAddress: blockchain.ethWrapperAddress }
            case 'btc':
                contract = this.btcContract
                return { contract, contractAddress: blockchain.btcWrapperAddress }
            case 'usdt':
                contract = this.usdtContract
                return { contract, contractAddress: blockchain.usdtWrapperAddress }
            default:
                return contract
            }
        },
        convertWithdrawAmount (amount) {
            let result
            switch (this.toWrapToken.name.toLowerCase()) {
            case 'eth':
                result = new BigNumber(this.amount).multipliedBy(10 ** 18).toString(10)
                return result
            case 'btc':
                result = new BigNumber(this.amount).multipliedBy(10 ** 8).toString(10)
                return result
            case 'usdt':
                result = new BigNumber(this.amount).multipliedBy(10 ** 6).toString(10)
                return result
            default:
                return result
            }
        }
    }
}
</script>
