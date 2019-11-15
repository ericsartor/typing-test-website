<template>
    <div>
        <div class="achievements">
            <app-achievement
                v-for="achievement in achievements.achievements"
                :key="achievement.label"
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
import { Achievements} from '../js/achievements';
const achievements = new Achievements();

import Achievement from '~/components/Achievement.vue';

export default {
    components: {
        'app-achievement': Achievement,
    },
    data() {
        return {
            achievements: achievements,
        };
    },
}
</script>