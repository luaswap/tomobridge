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
                {{ $t('fee') }}: {{ fee }}
                {{ tomoFeeMode ? '' : fromWrapToken.name || '' }}
                {{ tomoFeeMode ? 'TOMO' : toWrapToken.name }}</p>
        </div>
        <div class="step-one__buttons">
            <b-button
                class="btn--big"
                @click="back">{{ $t('cancelBtn') }}</b-button>
            <b-button
                class="btn--big"
                variant="primary"
                @click="beforeWithdraw">{{ $t('unwrapBtn') }}</b-button>
        </div>
        <b-modal
            id="withdrawWarningModal"
            ref="withdrawWarningModal"
            centered
            scrollable
            size="md"
            no-close-on-esc
            hide-footer>
            <template #modal-title>
                <div class="text-danger">Warning <i class="tb-warning " /></div>
            </template>
            Due to the sky-high gas fees on Ethereum, TomoBridge withdrawal transactions will take longer to process.
            <div class="modal-buttons mt-4">
                <b-button @click="closeModal">Quit</b-button>
                <b-button
                    variant="primary"
                    @click="nextStep">Continue</b-button>
            </div>
        </b-modal>
    </b-container>
</template>

<script>

import BigNumber from 'bignumber.js'
import store from 'store'
import urljoin from 'url-join'
import axios from 'axios'
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
            coinName: '',
            amount: '',
            gasPrice: 0,
            address: this.$store.state.address || '',
            receiveAddress: this.$route.params.receiveAddress || '',
            fromWrapToken: this.parent.fromWrapToken || {},
            toWrapToken: this.parent.toWrapToken || {},
            config: {},
            balance: 0,
            fee: 0,
            receiveAmount: 0,
            contract: '',
            contractAddress: '',
            feeAmount: '',
            tomoFeeMode: false,
            showWithdrawWarning: false
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        this.coinName = this.toWrapToken.name
        this.config = store.get('configBridge') || await this.appConfig() || {}
        const { contract, contractAddress } = await this.getContract()
        this.contract = contract
        this.contractAddress = contractAddress
        this.tomoFeeMode = await this.contract.methods.TOMO_FEE_MODE.call()
        await this.getWithdrawFee()

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
                    this.checkReceiveAmount(coin)
                    const provider = this.NetworkProvider
                    const chainConfig = this.config.blockchain
                    let txParams = {
                        value: this.tomoFeeMode ? this.web3.utils.toHex(this.feeAmount) : this.web3.utils.toHex(0),
                        from: this.address,
                        gasPrice: this.web3.utils.toHex(this.gasPrice),
                        gas: this.web3.utils.toHex(chainConfig.gas),
                        gasLimit: this.web3.utils.toHex(chainConfig.gas)
                    }

                    if (provider === 'ledger' || provider === 'trezor' || provider === 'trustwallet') {
                        par.loading = true
                        let data = await this.contract.methods.burn(
                            this.web3.utils.toHex(this.convertWithdrawAmount(this.amount)),
                            this.string2byte(this.receiveAddress)
                        ).encodeABI()

                        const dataTx = {
                            data,
                            to: this.contractAddress
                        }
                        const nonce = await this.web3.eth.getTransactionCount(this.address)

                        Object.assign(
                            dataTx,
                            dataTx,
                            txParams,
                            {
                                nonce: this.web3.utils.toHex(nonce)
                            }
                        )
                        let signature = await this.signTransaction(dataTx)
                        // delete dataTx.value
                        const txHash = await this.sendSignedTransaction(dataTx, signature)
                        if (txHash) {
                            this.$refs.withdrawWarningModal.hide()
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
                        this.contract.methods.burn(
                            this.convertWithdrawAmount(this.amount),
                            this.string2byte(this.receiveAddress)
                        ).send(txParams)
                            .on('transactionHash', async (txHash) => {
                                this.$refs.withdrawWarningModal.hide()
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
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
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
            this.$router.push({ path: '/wrap' })
        },
        getContract () {
            let id = this.toWrapToken
            let swapCoin = this.config.objSwapCoin
            let tokenSymbol = id.name.toLowerCase()
            let contract = new this.web3.eth.Contract(
                // this.WrapperAbi.abi,
                this.TomoBridgeTokenAbi.abi,
                swapCoin[tokenSymbol].wrapperAddress.toLowerCase()
            )
            return { contract, contractAddress: swapCoin[tokenSymbol].wrapperAddress }
        },
        async getBalance () {
            try {
                if (this.address) {
                    // const { contract } = this.getContract()
                    if (this.contract) {
                        const balance = await this.contract.methods.balanceOf(this.address).call()
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
        },
        async getWithdrawFee () {
            const coin = this.config.objSwapCoin[this.coinName.toLowerCase()]
            let feeBN
            if (this.tomoFeeMode) {
                feeBN = await this.contract.methods.WITHDRAW_FEE_TOMO().call()
                this.fee = new BigNumber(feeBN).div(10 ** 18).toString(10)
                this.feeAmount = new BigNumber(feeBN).toString(10)
            } else {
                feeBN = await this.contract.methods.WITHDRAW_FEE().call()
                this.fee = new BigNumber(feeBN).div(10 ** coin.decimals).toString(10)
            }
        },
        async checkReceiveAmount (coin) {
            const parent = this.parent
            if (this.tomoFeeMode) {
                parent.receiveAmount = this.amount
            } else {
                parent.receiveAmount = new BigNumber(this.amount).minus(new BigNumber(this.fee)).toNumber()
            }
            if (new BigNumber(this.amount).isLessThan(new BigNumber(coin.minimumWithdrawal))) {
                parent.receiveAmount = 0
            }
        },
        async checkETHGasPrice () {
            try {
                // gwei = 250
                const { data } = await axios.get(
                    'https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=250000000000'
                )
                const estimateTime = data.result / 60
                if (estimateTime > 15) {
                    this.showWithdrawWarning = true
                } else {
                    this.showWithdrawWarning = false
                }
            } catch (error) {
                console.log(error)
            }
        },
        showWarningModal () {
            this.$refs.withdrawWarningModal.show()
        },
        closeModal () {
            this.$refs.withdrawWarningModal.hide()
        },
        async beforeWithdraw () {
            await this.checkETHGasPrice()
            if (this.showWithdrawWarning) {
                this.showWarningModal()
            } else {
                this.nextStep()
            }
        }
    }
}
</script>
