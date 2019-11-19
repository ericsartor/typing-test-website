<template>
    <div class="timeline" ref="timeline" @mousedown="handleMouseDown">
        <div class="highlight" :style="highlightDivStyles"></div>
    </div>
</template>

<style scoped>
.timeline {
    width: 100%;
    height: 20px;
    border: 1px solid black;
}

.highlight {
    position: relative;
    top: 0;
    height: 18px;
    background: rgba(0, 0, 0, 0.5);
}
</style>

<script>
export default {
    props: {
        timestamps: {
            required: true,
            type: Array,
        },
    },
    data() {
        return {
            timeframeStartPercent: null,
            timeframeEndPercent: null,
            dragging: false,
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
            return this.timeframeStartPercent > this.timeframeEndPercent;
        },
        highlightDivStyles() {
            if (this.timeframeStartPercent === null || this.timeframeEndPercent === null) {
                return {
                    display: 'none',
                };
            } else {
                const { width, left } = this.getTimelineRect();

                const highlightStart = this.isReversed ?
                    this.timeframeEndPercent * width :
                    this.timeframeStartPercent * width;
                const highlightEnd = Math.abs(this.timeframeStartPercent - this.timeframeEndPercent) * width + highlightStart;

                const leftCssValue = highlightStart;
                const widthCssValue = highlightEnd - highlightStart;
                return {
                    position: 'relative',
                    left: leftCssValue + 'px',
                    width: widthCssValue + 'px',
                };
            }
        },
    },
    methods: {
        getTimelineRect() {
            return this.$refs.timeline.getBoundingClientRect();
        },
        calculateMouseEventPercent(clientX) {
            const { width, left } = this.getTimelineRect();
            return (clientX - left) / width;
        },
        handleMouseDown({ clientX }) {
            this.timeframeStartPercent = this.calculateMouseEventPercent(clientX);
            this.timeframeEndPercent = null;
            this.dragging = true;

            window.addEventListener('mouseup', () => {
                this.dragging = false;

                if (this.timeframeStartPercent !== null && this.timeframeStart !== null) {
                    this.$emit('timeframechange', {
                        start: this.getTimestampFromPercent(this.isReversed ? this.timeframeEndPercent : this.timeframeStartPercent),
                        end: this.getTimestampFromPercent(this.isReversed ? this.timeframeStartPercent : this.timeframeEndPercent),
                    });
                }
            }, { once: true });
        },
        reset() {
            this.timeframeStartPercent = null;
            this.timeframeEndPercent = null;
        },
        getTimestampFromPercent(percent) {
            return (this.endTimestamp - this.startTimestamp) * percent + this.startTimestamp;
        }
    },
    beforeMount() {
        window.addEventListener('mousemove', ({ clientX }) => {
            if (!this.dragging) return;

            this.timeframeEndPercent = Math.min(Math.max(this.calculateMouseEventPercent(clientX), 0), 1);
        });
    },
}
</script>