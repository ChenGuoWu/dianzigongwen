export default {
    data() {
        return {

        }
    },
    computed: {
        state() {
            return this.$store.state;
        },
        router() {
            return this.$route.query
        },
    },
    mounted() {

    },
}