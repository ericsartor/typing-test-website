<template>
    <div v-if="achievements">
        <div class="achievements">
            {{ log() }}
            <app-achievement
                v-for="achievement in achievements.allAchievements"
                :key="achievement.details.name"
                :achievement="achievement"
                size="full" />
        </div>
    </div>
</template>

<style scoped>
.achievements {
    display: flex;
    flex-flow: row wrap;
    width: 90%;
    margin: 20px 5%;
}


</style>

<script>

import Achievement from '~/components/Achievement.vue';

import { mapState } from 'vuex';

export default {
    components: {
        'app-achievement': Achievement,
    },
    computed: {
        ...mapState('user', [
            'achievements',
        ]),
    },
    methods: {
        log() {
            console.log(this.achievements.allAchievements);
        }
    }
}
</script>