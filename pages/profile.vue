<template>
    <div>
        <div v-if="profile && achievements" class="profile">
            <div class="top-bar">
                <h1 class="display-name text-2xl">{{ displayName }}</h1>
                <div>
                    <app-button type="pink">Delete Account</app-button>    
                    <app-button type="blue">Change Password</app-button>    
                </div>
            </div>

            <div class="stats-container">
                <div class="text-stats-container">
                    <h2>Overall Stats</h2>

                    <p>{{ tests.length }} completed tests</p>
                    <p>{{ tests.filter((test) => test.accuracy === 100).length }} perfect tests</p>
                    <p>{{ averageAccuracy(tests) }}% accuracy</p>

                    <h2>Timeframe Stats</h2>

                    <p>{{ testsInTimeframe.length }} completed tests</p>
                    <p>{{ testsInTimeframe.filter((test) => test.accuracy === 100).length }} perfect tests</p>
                    <p>{{ averageAccuracy(testsInTimeframe) }}% accuracy</p>
                </div>

                <div class="timeline-graph-container">
                    <p class="text-center">{{ startOfTimeframeDatestring }} - {{ endOfTimeframeDatestring }}</p>

                    <app-timeline
                        :timestamps="[ ...tests ].sort((testA, testB) => testA.timestamp - testB.timestamp).map((test) => test.timestamp)"
                        v-model="timeframe" />

                    <a
                        href=""
                        v-for="property in chartDataTypes"
                        :key="property"
                        @click.prevent="chartDataType = property"
                        class="mr-2 pb-1"
                        :style="{ 'font-weight': chartDataType === property ? 'bold' : '', 'border-bottom': chartDataType === property ? '2px solid black' : '' }">{{ property }}</a>

                    <app-chart width="100%" :title="false" :setup="chartSetup" :key="Date.now()" />
                </div>
            </div>

            <div class="experience-and-achievements">
                <h2>Next Achievements...</h2>
                <div class="achievements">
                    <app-achievement
                        v-for="achievement in soonAchievements"
                        :key="achievement.label"
                        :achievement="achievement"
                        size="full" />
                </div>

                <h2>Recent Achievements...</h2>
                <div class="achievements">
                    <app-achievement
                        v-for="achievement in achievements.completedAchievements"
                        :key="achievement.name"
                        :achievement="achievement"
                        size="full" />
                </div>
            </div>

            <hr>
        </div>
    </div>
</template>

<style scoped>
.profile {
    margin: 20px auto;
    padding: 20px;
    background: white;
    /* border: 6px solid rgb(228, 245, 255); */
    border-radius: 3px;
    box-shadow: 10px 10px 10px rgb(184, 184, 184);
    width: 70%;
    max-width: 1200px;
}

.top-bar {
    display: flex;
    flex-flow: row-nowrap;
    justify-content: space-between;
}

.stats-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 20px;
}

.text-stats-container, .timeline-graph-container {
    width: 50%;
}

.timeline-graph-container {
    text-align: center;
}

.achievements {
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
}

.achievements .achievement {
    margin-right: 10px;
}

h2 {
    text-indent: 20px;
    margin: 20px 0 20px 0px;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import Achievement from '~/components/Achievement.vue';
import Chart from '~/components/Chart.vue';
import Timeline from '~/components/Timeline.vue';
import Button from '~/components/Button.vue';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jnauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default {
    name: 'profile',
    components: {
        'app-achievement': Achievement,
        'app-button': Button,
        'app-chart': Chart,
        'app-timeline': Timeline,
    },
    data() {
        return {
            timeframe: {
                start: 0,
                end: Date.now(),
            },
            chartDataType: 'WPM',
            chartDataTypes: [ 'WPM', 'KPM', 'Accuracy' ],
        };
    },
    computed: {
        ...mapState('user', [
            'profile',
            'achievements',
        ]),
        ...mapGetters('user', [
            'displayName',
            'tests',
        ]),
        soonAchievements() {
            return this.achievements.incompleteAchievementsByProgress.slice(0, 3);
        },
        testsInTimeframe() {
            return this.tests.filter((test) => {
                return test.timestamp >= this.timeframe.start &&
                    test.timestamp <= this.timeframe.end;
            });
        },
        startOfTimeframeDatestring() {
            const d = new Date(this.timeframe.start);
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        },
        endOfTimeframeDatestring() {
            const d = new Date(this.timeframe.end);
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        },
        chartSetup() {
            const dataProperty = this.chartDataType.toLowerCase();
            const data = this.testsInTimeframe
                .sort((testA, testB) => testA.timestamp - testB.timestamp)
                .map((test, i) => ({ y: test[dataProperty], x: i }));

            return {
                title: this.chartDataType,
                type: 'line',
                data: {
                    labels: [this.chartDataType],
                    datasets: [
                        {
                            label: this.chartDataType,
                            // borderColor: 'rgb(0, 0, 0, )',
                            pointBackgroundColor: 'rgb(125, 125, 125)',
                            backgroundColor: '#FF5714',
                            data,
                            lineTension: 0,
                        },
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                type: 'linear',
                            },
                        ],
                        yAxes: [
                            {
                                ticks: { beginAtZero: true },
                            },
                        ],
                    },
                },
            };
        },
        wordErrorGraphSetup() {
            // { [word: stirng]: number } from every test taken
            const overallErrorMap = this.testsInTimeframe.reduce((overallErrorMap, test) => {
                Object.keys(test.errorMap || {}).forEach((word) => {
                    overallErrorMap[word] = overallErrorMap[word] ?
                        overallErrorMap[word] + test.errorMap[word] : test.errorMap[word];
                });

                return overallErrorMap;
            }, {});

            // sort words by most errors and grab the top 10 most errored
            const labels = Object.keys(overallErrorMap)
                .sort((wordA, wordB) => {
                    return overallErrorMap[wordB] - overallErrorMap[wordA];
                })
                .slice(0, this.numOfWordsInBarChart);

            // the numeric error values for the top 10 most mispelled words
            const data = labels.map((word) => overallErrorMap[word]);

            return {
                title: 'Misspelled Words',
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Number Of Errors',
                            backgroundColor: '#FF5714',
                            data,
                        },
                    ]
                },
                options: {
                    responsive: true,
                    aspectRatio: 5 / 1,
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                }
                            }
                        ]
                    }
                },
            };
        },
    },
    methods: {
        averageAccuracy(tests) {
            const accuracy = Math.round((tests.reduce((acc, test) => acc + test.accuracy, 0) / tests.length));
            return isNaN(accuracy) ? 0 : accuracy;
        },
    },
}
</script>