<template>
    <div>
        <h1>{{ displayName }}</h1>
    </div>
</template>

<style scoped>

</style>

<script>
import { mapState, mapGetter } from 'vuex';

export default {
    name: 'profile',
    computed: {
        ...mapState('user', [
            
        ]),
        ...mapGetters('user', [
            'displayName'
        ]),
    }, 
}
</script>