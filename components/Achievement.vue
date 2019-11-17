<template>
    <div class="achievement" :class="{ icon: size === 'icon' }">

        <!-- full template -->
        <template v-if="size === 'full'">
            <img :src="imageSource">
            <div class="achievement-text">
                <span class="achievement-label">{{ name }}</span>
                <p class="achievement-description">{{ description }}</p>
                <div class="progress-bar" v-if="!isFulfilled">
                    <div
                        class="bar"
                        :style="{ width: progressPercent + '%' }" />
                    <p class="progress-text">
                        {{ progressLabel }}
                    </p>
                </div>
            </div>
        </template>

        <!-- icon template -->
        <template v-if="size === 'icon'">

            <!-- icon -->
            <img :src="imageSource" @mouseenter="handleIconHover" @mouseleave="handleIconLeave">
            
            <!-- hover info card -->
            <div class="hover-info" :class="{ show: displayInfo }">
                <div class="achievement-text">
                    <span class="achievement-label">{{ name }}</span>
                    <p class="achievement-description">{{ description }}</p>
                    <div class="progress-bar" v-if="!isFulfilled">
                        <div
                            class="bar"
                            :style="{ width: progressPercent + '%' }" />
                        <p class="progress-text">
                            {{ progressLabel }}
                        </p>
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
    height: 80px;
    width: 33.3%;
}

.icon {
    width: 80px;
    padding: 0;
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
    z-index: 0;
    height: 13px;
}

.progress-text {
    position: relative;
    z-index: 1;
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
    box-shadow: 0 0 5px black;
}
.hover-info.show {
    display: block;
}
</style>

<script>
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
        imageSource() {
            return this.svg ? `/svg/${this.svg}.svg` : '';
        },
        progressPercent() {
            const progress = Math.min(this.progress, this.qualifier);

            return progress / this.qualifier * 100;
        }
    },
    methods: {
        handleIconHover() {
            this.displayInfo = true;
        },
        handleIconLeave() {
            this.displayInfo = false;
        },
    },
    beforeMount() {
        const { name, description, svg } = this.achievement.achievement;
        const { progress, isFulfilled, qualifier } = this.achievement;

        this.name = name;
        this.description = description;
        this.svg = svg;
        this.progress = progress;
        this.isFulfilled = isFulfilled;
        this.qualifier = qualifier;
        this.progressLabel = this.achievement.progressLabel;
    },
}
</script>