<template>
    <div class="achievement" :style="{ width: size === 'full' ? '33.3%' : '80px' }">
        <template v-if="size === 'full'">
            <img :src="imageSource">
            <div class="achievement-text">
                <span class="achievement-label">{{ achievement.label }}</span>
                <p class="achievement-description">{{ achievement.description }}</p>
                <div class="progress-bar">
                    <template v-if="achievement.getProgress">
                        <div
                            class="bar"
                            :style="{ width: achievement.getProgress(tests).percent + '%' }" />
                        <p class="progress-text">
                            {{ achievement.getProgress(tests).label }}
                        </p>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="size === 'icon'">
            <img :src="imageSource" @mouseenter="handleIconHover" @mouseleave="handleIconLeave">
            <div class="hover-info" :class="{ show: displayInfo }">
                <div class="achievement-text">
                    <span class="achievement-label">{{ achievement.label }}</span>
                    <p class="achievement-description">{{ achievement.description }}</p>
                    <div class="progress-bar">
                        <template v-if="achievement.getProgress">
                            <div
                                class="bar"
                                :style="{ width: achievement.getProgress(tests).percent + '%' }" />
                            <p class="progress-text">
                                {{ achievement.getProgress(tests).label }}
                            </p>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.achievement {
    display: flex;
    flex-flow: row nowrap;
    margin: 10px 0;
    padding: 0 5px;
    position: relative;
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

.hover-info {
    position: absolute;
    top: 0px;
    left: 90px;
    width: 300px;
    height: 100px;
    display: none;
    background: white;
    z-index: 1;
}
.hover-info.show {
    display: block;
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        achievement: {
            type: Object,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            displayInfo: false,
        };
    },
    computed: {
        ...mapGetters('user', [
            'tests',
        ]),
        imageSource() {
            return this.achievement.svg ? `/svg/${this.achievement.svg}.svg` : '';
        },
    },
    methods: {
        handleIconHover() {
            this.displayInfo = true;
        },
        handleIconLeave() {
            this.displayInfo = false;
        },
    },
}
</script>