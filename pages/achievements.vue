<template>
    <div>
        <div class="achievements">
            <div class="achievement" v-for="(achievement, i) in achievements.achievements" :key="achievement.label">
                <img :src="achievement.svg ? `/svg/${achievement.svg}.svg` : ''">
                <div class="achievement-text">
                   <span class="achievement-label">{{ achievement.label }}</span>
                   <p class="achievement-description">{{ achievement.description }}</p>
                   <div class="progress-bar" v-if="achievement.getProgress">
                       <div class="bar" :style="{ width: achievement.getProgress(tests).percent + '%' }"></div>
                       <p class="progress-text">
                           {{ achievement.getProgress(tests).label }}
                        </p>
                   </div>
                </div>
            </div>
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

.achievement {
    display: flex;
    flex-flow: row nowrap;
    width: 33.3%;
    margin: 10px 0;
}

.achievement img {
    width: 80px;
    height: 80px;
    border: 1px solid black;
}

.achievement-text {
    height: 70px;
    margin-left: 20px;
    margin-top: 10px;
    width: 80%;
}

.achievement-text .achievement-label {
    height: 20px;
    line-height: 20px;
    font-size: 1.3em;
    margin: 0;
}

.achievement-text .achievement-description {
    height: 30px;
    line-height: 15px;
    font-size: 0.8em;
}

.achievement-text .progress-bar {
    width: 100%;
    position: relative;
    height: 15px;
    line-height: 15px;
    font-size: 0.6em;
    text-align: center;
    border: 1px solid black;
}

.achievement-text .progress-bar .bar {
    position: absolute;
    top: 0;
    left: 0;
    background-color: green;
    z-index: -1;
    height: 13px;
}
</style>

<script>
import Achievements from '../js/achievements';

import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            achievements: { ...Achievements },
        };
    },
    computed: {
        ...mapGetters('user', [
            'tests',
        ]),
    },
}
</script>