<template>
    <div :style="{ width: width }">
        <h2>{{ setup.title }}</h2>
        <div class="chart-container">
            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<style scoped>
.chart-container {
    position: relative;
}

h2 {
    text-align: center;
    font-size: 2em;
}
</style>

<script>
export default {
    props: ['setup', 'width'],
    data() {
        return {
            chart: null,
            barColors: [ '#EA526F', '#3DC2F7', '#FF5714' ],
        };
    },
    mounted() {
        if (this.setup.type === 'bar') {
            const dataset = this.setup.data.datasets[0];
            dataset.backgroundColor = dataset.data.map((data, i) => {
                return this.barColors[i % this.barColors.length];
            });
        }

        this.setup.options.legend = { display: false };

        this.chart = new Chart(this.$refs.chart, this.setup);
    },
}
</script>