<template>
    <div>
        <b-container class="txs">
            <h1 class="txs__headline">{{ $t('txHistory') }}</h1>
            <b-tabs
                no-nav-style>
                <b-tab
                    title="Wrap"
                    active>
                    <b-table
                        :items="txs"
                        :fields="fields"
                        :per-page="perPage"
                        :class="loading ? 'table--loading' : ''"
                        :show-empty="true"
                        :empty-text="$t('emptyText')"
                        stacked="lg"
                        class="txs__table">

                        <template
                            slot="createdAt"
                            slot-scope="data">
                            <span :id="`timestamp__${data.index}`">{{ data.item.createdAt }}</span>
                            <b-tooltip :target="`timestamp__${data.index}`">
                                {{ data.item.dateTooltip }}
                            </b-tooltip>
                        </template>

                        <template
                            slot="from"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.from }}</a>
                            </p>
                        </template>

                        <template
                            slot="arrow">
                            <i class="tb-arrow-right"/>
                        </template>

                        <template
                            slot="to"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.to }}</a>
                            </p>
                        </template>

                        <template
                            slot="hash"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.hash }}</a>
                            </p>
                        </template>
                    </b-table>

                    <b-pagination
                        :total-rows="totalRows"
                        :per-page="perPage"
                        v-model="currentPage"
                        align="center" />
                </b-tab>
                <b-tab title="Unwrap">
                    <b-table
                        :items="txs"
                        :fields="fields"
                        :per-page="perPage"
                        :class="loading ? 'table--loading' : ''"
                        :show-empty="true"
                        empty-text="There are no transactions to show"
                        stacked="lg"
                        class="txs__table">

                        <template
                            slot="createdAt"
                            slot-scope="data">
                            <span :id="`timestamp__${data.index}`">{{ data.item.createdAt }}</span>
                            <b-tooltip :target="`timestamp__${data.index}`">
                                {{ data.item.dateTooltip }}
                            </b-tooltip>
                        </template>

                        <template
                            slot="from"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.from }}</a>
                            </p>
                        </template>

                        <template
                            slot="arrow">
                            <i class="tb-arrow-right"/>
                        </template>

                        <template
                            slot="to"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.to }}</a>
                            </p>
                        </template>

                        <template
                            slot="hash"
                            slot-scope="data">
                            <p class="text-truncate">
                                <a href="#">{{ data.item.hash }}</a>
                            </p>
                        </template>
                    </b-table>

                    <b-pagination
                        :total-rows="totalRows"
                        :per-page="perPage"
                        v-model="currentPage"
                        align="center" />
                </b-tab>
            </b-tabs>
        </b-container>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: { },
    data () {
        return {
            fields: [
                { key: 'createdAt', label: 'Age' },
                { key: 'from', label: 'From' },
                { key: 'arrow', label: '' },
                { key: 'to', label: 'To' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'hash', label: 'Txn Hash' }
            ],
            txs: [
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    dateTooltip: 'Feb 16, 2020 10:10',
                    createdAt: 'a few seconds ago',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: 'a few seconds ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '8 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '8 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '18 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '28 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                },
                {
                    createdAt: '38 mins ago',
                    dateTooltip: 'Feb 16, 2020 10:10',
                    from: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    to: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7',
                    quantity: '1 TOMO',
                    hash: '0x5d41ad59abafbd056e38d9c8aca9426b5aca0d1c2cc612f980ebffb9e0523ff7'
                }
            ],
            loading: false,
            totalRows: 10,
            perPage: 10,
            currentPage: 1,
            tableCssClass: ''
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: {}
}
</script>
