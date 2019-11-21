<template>
    <div class="timeline-container" @click.prevent>
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
        // array of Epoch millisecond timestamps
        timestamps: {
            required: true,
            type: Array,
        },

        // { start: timestamp, end: timestamp }
        // the currently selected range of time within the timeline
        value: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {
            timeframeAnchorPercent: 0,  // calculated when a mousedown event happens
            timeframeReleasePercent: 1, // calculated when a mouseup event happens
            dragging: false,            // flipped to true after a mousedown and back after mouseup
            timelineRefExists: false,   // flipped after the component mounts and refs are available
        };
    },
    computed: {
        // earliest timestamp in the array
        startTimestamp() {
            return this.timestamps[0];
        },

        // latest timestamp in the array
        endTimestamp() {
            return this.timestamps[this.timestamps.length - 1];
        },

        // array of Day objects, each representing the timestamps in a given day
        // days without timestamps are generated between days with timestamps for the full time range
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

        // width of a day's worth of timestamps on the timeline
        dayWidthInPercent() {
            return 100 / this.days.length;
        },

        // the length of the timestamps array on the day with the most timestamps
        // used to calculate the color of each day based on how many timestamps there are in it
        mostTimestampsInDay() {
            return this.days.reduce((highest, day) => Math.max(highest, day.timestamps.length), 0);
        },

        // styles for the highlight selection element
        highlightDivStyles() {
            if (this.timeframeAnchorPercent === null || this.timeframeReleasePercent === null) {
                return {
                    display: 'none',
                };
            } else {
                const startPercent = Math.min(this.timeframeAnchorPercent, this.timeframeReleasePercent);
                const endPercent = Math.max(this.timeframeAnchorPercent, this.timeframeReleasePercent);

                return {
                    position: 'relative',
                    left: startPercent * 100 + '%',
                    width: (endPercent - startPercent) * 100 + '%',
                };
            }
        },
    },
    methods: {

        // returns a dummy rect object until the component's refs are available
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

        // when a mouse event happens, calculate what percentage along the timeline it happened on
        calculateMouseEventPercent(clientX) {
            const { width, left } = this.getTimelineRect();
            return (clientX - left) / width;
        },

        // sets the timeframeAnchorPercent and sets up a one-time mouseup listener to emit
        // an update once the timeline highlight drag is complete
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

        // generate a timestamp from the timeline based on a percentage
        getTimestampFromPercent(percent) {
            return (this.endTimestamp - this.startTimestamp) * percent + this.startTimestamp;
        },

        // highlight the whole timeline then emit an update 
        selectWholeTimeline() {
            this.timeframeAnchorPercent = 0;
            this.timeframeReleasePercent = 1;

            this.update();
        },

        // by default, emit an update for v-model based on the current highlight selection,
        // but if an updateOverride is passed in, emit that instead
        update(updateOverride) {
            const update = {
                start: this.getTimestampFromPercent(Math.min(this.timeframeAnchorPercent, this.timeframeReleasePercent)),
                end: this.getTimestampFromPercent(Math.max(this.timeframeAnchorPercent, this.timeframeReleasePercent)),
            };

            this.$emit('input', updateOverride || update);
        },
    },
    beforeMount() {

        // everytime the mouse moves while dragging = true, update the timeframeReleasePercent
        // so that the higlight element expands to meet the mouse, but do not emit an update
        window.addEventListener('mousemove', ({ clientX }) => {
            if (!this.dragging) return;

            // ensure the percent cannot go below 0 or above 1
            this.timeframeReleasePercent = Math.min(Math.max(this.calculateMouseEventPercent(clientX), 0), 1);
        });

        // by default, select the whole timeline
        this.update({
            start: this.startTimestamp,
            end: this.endTimestamp,
        });
    },
    mounted() {
        // once mounted, refs are avaiable
        this.timelineRefExists = true;
    },
}
</script>