<template>
    <div class="timeline-container" :key="resizeTimestamp" @click.prevent>
        <div class="timeline" ref="timeline" @mousedown.prevent="handleMouseDown" @dblclick.prevent="selectWholeTimeline">
            <div class="day-container" @click.prevent>
                <div
                    class="day"
                    v-for="(day, i) in days" :key="i"
                     @click.prevent
                    :style="{ width: dayWidthInPercent + '%', background: `rgba(255, 0, 0, ${day.timestamps.length / mostTimestampsInDay})` }"
                    :title="day.date ? `${day.date.toDateString()}, ${day.timestamps.length} tests` : 'No tests.'" />
            </div>
            <div class="highlight" :style="highlightDivStyles" @drag.prevent @click.prevent></div>
        </div>
    </div>
</template>

<style scoped>
.timeline-container {
    width: 100%;
}

.timeline {
    position: relative;
    width: 100%;
    height: 20px;
    /* border: 1px solid black; */
}

.highlight {
    position: absolute;
    top: 0px;
    height: 18px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2;
}

.day-container {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
}

.day {
    background: linear-gradient(to right, red, yellow);
    height: 18px;
}
</style>

<script>
export default {
    props: {
        timestamps: {
            required: true,
            type: Array,
        },
        value: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            timeframeAnchorPercent: 0,
            timeframeReleasePercent: 1,
            dragging: false,
            timelineRefExists: false,
            resizeTimestamp: 0,
        };
    },
    computed: {
        startTimestamp() {
            return this.timestamps[0];
        },
        endTimestamp() {
            return this.timestamps[this.timestamps.length - 1];
        },
        isReversed() {
            return this.timeframeAnchorPercent > this.timeframeReleasePercent;
        },
        days() {
            const dayInMilliseconds = 1000 * 60 * 60 * 24;

            const firstDate = new Date(this.timestamps[0]);
            const days = [ { timestamps: [], date: firstDate } ];

            this.timestamps.forEach((timestamp) => {
                const timestampDate = new Date(timestamp);
                const latestDay = days[days.length - 1];

                if (timestampDate.toDateString() === latestDay.date.toDateString()) {
                    latestDay.timestamps.push(timestamp);
                } else {
                    const nextDayDate = new Date(latestDay.date.getTime() + dayInMilliseconds);

                    // add day objects for all the days between the previous and current timestamp
                    if (timestampDate.toDateString() !== nextDayDate.toDateString()) {
                        const nextDayMidnightDate = new Date(nextDayDate.toDateString());
                        const nextTimestampMidnightDate = new Date(timestampDate.toDateString());
                        const daysBetween = Math.round((nextTimestampMidnightDate.getTime() - nextDayMidnightDate.getTime()) / dayInMilliseconds);
    
                        for (let i = 0; i < daysBetween; i++) {
                            days.push({ timestamps: [], date: null });
                        }
                    }

                    days.push({ timestamps: [ timestamp ], date: timestampDate });
                }
            });

            return days;
        },
        dayWidthInPercent() {
            return 100 / this.days.length;
        },
        mostTimestampsInDay() {
            return this.days.reduce((highest, day) => Math.max(highest, day.timestamps.length), 0);
        },
        highlightDivStyles() {
            if (this.timeframeAnchorPercent === null || this.timeframeReleasePercent === null) {
                return {
                    display: 'none',
                };
            } else {
                const startPercent = Math.min(this.timeframeAnchorPercent, this.timeframeReleasePercent);
                const endPercent = Math.max(this.timeframeAnchorPercent, this.timeframeReleasePercent);
                console.log(startPercent, endPercent);
                return {
                    position: 'relative',
                    left: startPercent * 100 + '%',
                    width: (endPercent - startPercent) * 100 + '%',
                };
            }
        },
    },
    methods: {
        getTimelineRect() {
            return this.timelineRefExists ? this.$refs.timeline.getBoundingClientRect() :
                {
                    width: 0,
                    height: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                };
        },
        calculateMouseEventPercent(clientX) {
            const { width, left } = this.getTimelineRect();
            return (clientX - left) / width;
        },
        handleMouseDown({ clientX }) {
            this.timeframeAnchorPercent = this.calculateMouseEventPercent(clientX);
            this.timeframeReleasePercent = null;
            this.dragging = true;

            window.addEventListener('mouseup', () => {
                this.dragging = false;

                if (this.timeframeAnchorPercent !== null && this.timeframeStart !== null) {
                    this.update();
                }
            }, { once: true });
        },
        reset() {
            this.timeframeAnchorPercent = null;
            this.timeframeReleasePercent = null;
        },
        getTimestampFromPercent(percent) {
            return (this.endTimestamp - this.startTimestamp) * percent + this.startTimestamp;
        },
        selectWholeTimeline() {
            this.timeframeAnchorPercent = 0;
            this.timeframeReleasePercent = 1;
        },
        update(updateOverride) {
            const update = {
                start: this.getTimestampFromPercent(Math.min(this.timeframeAnchorPercent, this.timeframeReleasePercent)),
                end: this.getTimestampFromPercent(Math.max(this.timeframeAnchorPercent, this.timeframeReleasePercent)),
            };

            this.$emit('input', updateOverride || update);
        },
    },
    beforeMount() {
        window.addEventListener('mousemove', ({ clientX }) => {
            if (!this.dragging) return;

            this.timeframeReleasePercent = Math.min(Math.max(this.calculateMouseEventPercent(clientX), 0), 1);
        });

        window.addEventListener('resize', () => {
            this.resizeTimestamp = performance.now();
        });

        this.update({
            start: this.startTimestamp,
            end: this.endTimestamp,
        });
    },
    mounted() {
        this.timelineRefExists = true;
    },
}
</script>