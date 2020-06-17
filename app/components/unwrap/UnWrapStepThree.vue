<template>
    <b-container class="step-three text-center">
        <div v-if="!success">
            <h3 class="step-three__title">{{ $t('sendingToken1') }}</h3>
            <p class="step-three__subtitle">
                {{ convertAmount(inAmount) }} {{ toToken.name || '' }} {{ $t('sendingToken2') }}</p>
            <a
                :href="getAddressUrl(receiveAddress)"
                class="step-three__address text-truncate"
                target="_blank">
                {{ receiveAddress }}
            </a>
            <span>({{ $t('doneCheckingTx') }}
                <b-link
                    :to="'/txs'">
                    {{ $t('txHistory') }}
                </b-link>
                )
            </span>
        </div>
        <div
            v-else
            class="step-three__success">
            <i class="tb-check-circle-o step-three__icon text-primary"/>
            <h3 class="step-three__title">{{ $t('youWithdrawn') }} {{ convertAmount(outAmount) }}
                {{ toToken.name || '' }}</h3>
        </div>
        <div
            v-if="success"
            class="step-three__tx-hash">
            <p>
                {{ $t('txHash2') }}:
                <a
                    :href="getTxExplorerUrl(txHash)"
                    class="step-three__tx-hash-link text-truncate"
                    target="_blank">
                    {{ txHash }}
                </a>
            </p>
        </div>
        <b-button
            v-if="success"
            :to="'/'"
            variant="primary"
            class="step-three__button btn--big">{{ $t('unwrapAnotherTokenBtn') }}</b-button>
    </b-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import axios from 'axios'
import urljoin from 'url-join'
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
            address: this.$store.state.address || '',
            success: false,
            receiveAddress: this.parent.receiveAddress,
            txHash: '',
            inAmount: 0,
            outAmount: 0,
            fromToken: this.parent.fromWrapToken || {},
            toToken: this.parent.toWrapToken || {},
            interval: '',
            config: {}
        }
    },
    async updated () { },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    created: async function () {
        const parent = this.parent
        this.config = parent.config
        this.inAmount = this.toToken.amount
        this.scanTX()
            .then(data => {
                const inTx = data.transaction.InTx
                if (inTx.Hash === parent.transactionHash) {
                    this.inAmount = inTx.Amount
                }
            }).catch(e => {
                this.$toasted.show(e, { type: 'error' })
            })

        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction) {
                const inTx = data.transaction.InTx
                const outTx = data.transaction.OutTx
                if (inTx.Hash === parent.transactionHash) {
                    this.inAmount = inTx.Amount
                }

                if (outTx.Hash) {
                    this.txHash = outTx.Hash
                    this.outAmount = outTx.Amount
                    clearInterval(this.interval)
                    this.success = true
                }
            }
        }, 5000)
    },
    methods: {
        /**
         * Note: Add function to update "parent.step" to 4 after wrapping successfully
         * if (success) { parent.step++ }
         */
        convertAmount (amount) {
            let tokenSymbol = this.toToken.name.toLowerCase()

            let decimals = parseInt(this.config.objSwapCoin[tokenSymbol].decimals)
            return (new BigNumber(amount).div(10 ** decimals)).toString(10)
        },
        async scanTX () {
            const parent = this.parent
            const address = this.$store.state.address || ''
            const wrapToken = parent.toWrapToken
            const txData = await axios.get(
                `/api/wrap/getTransaction/withdraw/${wrapToken.name}/${address}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        },
        calculatePercentage (current, total) {
            if (current >= total) {
                return 100
            } else {
                return Math.floor((current * 100) / total)
            }
        },
        getTxExplorerUrl (txHash) {
            if (txHash) {
                const coin = this.config.objSwapCoin[this.toToken.name.toLowerCase()]
                if (coin) {
                    return urljoin(coin.explorerUrl, 'tx', txHash)
                }
            }
            return '#'
        },
        getAddressUrl (address) {
            try {
                const coin = this.config.objSwapCoin[this.toToken.name.toLowerCase()]
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
