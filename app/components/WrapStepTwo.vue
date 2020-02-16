<template>
    <b-container class="step-two text-center">
        <i class="tb-search step-two__icon"/>
        <p>
            We are looking for you transaction<br>
            Please stay tuned
        </p>
        <b-button
            class="step-two__button btn--big"
            @click="back">Back</b-button>
    </b-container>
</template>

<script>
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
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () { },
    methods: {
        back () {
            const par = this.parent
            par.step--
        }
    }
}
</script>
