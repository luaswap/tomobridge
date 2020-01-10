<template>
    <div>
        <div style="text-align:center">
            Wrap history
        </div>
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
    </div>
</template>

<script>
export default {
    name: 'App',
    components: { },
    data () {
        return {
            fromData: ['BTC'],
            toData: ['TRC21'],
            fromWrapSelected: null,
            toWrapSelected: null
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: {
        changeWrap () {
            const temp1 = this.fromData
            const temp2 = this.fromWrapSelected

            this.fromData = this.toData
            this.toData = temp1
            this.fromWrapSelected = this.toWrapSelected
            this.toWrapSelected = temp2
        }
    }
}
</script>
