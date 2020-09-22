<template>
    <b-container class="step-one text-center">
        <h3 class="step-one__title">{{ coinName + ' ' + $t('unwrapreceiveAddress') }}</h3>
        <a
            :href="getAddressUrl(receiveAddress)"
            class="step-three__address"
            target="_blank">
            {{ receiveAddress }}</a>
        <div class="step-one__address-box">
            <b-form-input
                v-model="amount"
                placeholder="Enter unwrap amount"
                type="text"/>
        </div>
        <div>
            <p
                v-if="address">
                {{ $t('balance') }}:
                <a
                    class="balance-btn"
                    @click="unwrapAll">{{ balance }}</a>
                {{ fromWrapToken.name || '' }} {{ toWrapToken.name }}</p>
            <p
                v-if="address">
                {{ $t('fee') }}: {{ fee }} {{ fromWrapToken.name || '' }} {{ toWrapToken.name }}</p>
        </div>
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">{{ $t('cancelBtn') }}</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="nextStep">{{ $t('unwrapBtn') }}</b-button>
        </div>
    </b-container>
</template>

<script>

import VueQrcode from '@chenfengyuan/vue-qrcode'
import BigNumber from 'bignumber.js'
import store from 'store'
import urljoin from 'url-join'
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
        this.config = store.get('configBridge') || await this.appConfig() || {}
        this.fee = this.config.objSwapCoin[this.coinName.toLowerCase()].withdrawFee

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
            const par = this.parent
            try {
                const coin = this.config.objSwapCoin[this.coinName.toLowerCase()]
                if (!this.checkMinimumWithdrawAmount()) {
                    this.$toasted.show(`${this.$t('minimumWithdraw')} ${coin.minimumWithdrawal} ${this.coinName}`)
                } else if (new BigNumber(this.amount).isLessThan(this.fee)) {
                    this.$toasted.show(this.$t('notEnoughFee'))
                } else {
                    const { contract, contractAddress } = this.getContract()
                    const provider = this.NetworkProvider
                    const chainConfig = this.config.blockchain
                    let txParams = {
                        from: this.address,
                        gasPrice: this.web3.utils.toHex(this.gasPrice),
                        gas: this.web3.utils.toHex(chainConfig.gas),
                        gasLimit: this.web3.utils.toHex(chainConfig.gas)
                    }

                    if (provider === 'ledger' || provider === 'trezor' || provider === 'trustwallet') {
                        par.loading = true
                        let data = await contract.methods.burn(
                            this.web3.utils.toHex(this.convertWithdrawAmount(this.amount)),
                            this.string2byte(this.receiveAddress)
                        ).encodeABI()

                        const dataTx = {
                            data,
                            to: contractAddress
                        }
                        const nonce = await this.web3.eth.getTransactionCount(this.address)

                        Object.assign(
                            dataTx,
                            dataTx,
                            txParams,
                            {
                                nonce: this.web3.utils.toHex(nonce),
                                value: this.web3.utils.toHex(0) // bypass hardware wallet to sign tx
                            }
                        )
                        let signature = await this.signTransaction(dataTx)
                        // delete dataTx.value
                        const txHash = await this.sendSignedTransaction(dataTx, signature)
                        if (txHash) {
                            par.transactionHash = txHash
                            let check = true
                            while (check) {
                                const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                if (receipt && receipt.status) {
                                    check = false
                                    par.loading = false
                                    par.step++
                                }
                            }
                        }
                    } else {
                        par.loading = true
                        contract.methods.burn(
                            this.convertWithdrawAmount(this.amount),
                            this.string2byte(this.receiveAddress)
                        ).send(txParams)
                            .on('transactionHash', async (txHash) => {
                                par.transactionHash = txHash
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt && receipt.status) {
                                        check = false
                                        par.loading = false
                                        par.step++
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                par.loading = false
                                this.$toasted.show(error, { type: 'error' })
                            })
                    }
                }
            } catch (error) {
                console.log(error)
                par.loading = false
                this.$toasted.show(error, { type: 'error' })
            }
        },
        back () {
            this.$router.push({ path: '/unwrap' })
        },
        getContract () {
            let id = this.toWrapToken
            let swapCoin = this.config.objSwapCoin
            let tokenSymbol = id.name.toLowerCase()
            let contract = new this.web3.eth.Contract(
                this.WrapperAbi.abi,
                swapCoin[tokenSymbol].wrapperAddress.toLowerCase()
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
        },
        unwrapAll () {
            this.amount = this.balance
        },
        checkMinimumWithdrawAmount () {
            const coin = this.config.objSwapCoin[this.coinName.toLowerCase()]
            if (new BigNumber(this.amount).isLessThan(new BigNumber(coin.minimumWithdrawal))) {
                return false
            }
            return true
        },
        getAddressUrl (address) {
            try {
                const coin = this.config.objSwapCoin[this.coinName.toLowerCase()]
                if (coin) {
                    return urljoin(coin.explorerUrl, 'address', address)
                }
                return '#'
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
