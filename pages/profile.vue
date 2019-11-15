<template>
    <div>
        <div v-if="profile" class="profile">
            <div class="top-bar">
                <h1 class="display-name text-2xl">{{ displayName }}</h1>
                <div>
                    <app-button type="pink">Delete Account</app-button>    
                    <app-button type="blue">Change Password</app-button>    
                </div>
            </div>

            <h2>Overall Stats</h2>

            <p>{{ tests.length }} completed tests</p>
            <p>{{ tests.filter((test) => test.accuracy === 100).length }} perfect tests</p>
            <p>{{ averageAccuracy(tests) }}% accuracy</p>

            <h2>Timeframe Stats ({{ startOfTimeframeDatestring }} - {{ endOfTimeframeDatestring }})</h2>

            <p>{{ testsInTimeframe.length }} completed tests</p>
            <p>{{ testsInTimeframe.filter((test) => test.accuracy === 100).length }} perfect tests</p>
            <p>{{ averageAccuracy(testsInTimeframe) }}% accuracy</p>

            <hr>

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
                        v-for="achievement in completedAchievements"
                        :key="achievement.label"
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
    margin: 40px 0 20px 0px;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';

import { Achievements } from '../js/achievements';
const achievements = new Achievements();

import Button from '~/components/Button.vue';
import Achievement from '~/components/Achievement.vue';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jnauary', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default {
    name: 'profile',
    components: {
        'app-achievement': Achievement,
        'app-button': Button,
    },
    data() {
        return {
            startOfTimeframe: (Date.now() - (1000 * 60 * 60 * 24 * 7)),
            endOfTimeframe: Date.now(),
        };
    },
    computed: {
        ...mapState('user', [
            'profile',
        ]),
        ...mapGetters('user', [
            'displayName',
            'tests',
        ]),
        completedAchievements() {
            return achievements.discover(this.tests);
        },
        achievementsInOrderByProgress() {
            return achievements.achievements
                .filter((achievement) => !achievement.isFulfilled(this.tests))
                .sort((achievementA, achievementB) => {
                    if (!achievementA.getProgress && !achievementB.getProgress) {
                        return 0;
                    } else if (!achievementA.getProgress) {
                        return 1;
                    } else if (!achievementB.getProgress) {
                        return -1;
                    }

                    const progressA = achievementA.getProgress(this.tests);
                    const progressB = achievementB.getProgress(this.tests);
                    
                    return progressB.percent - progressA.percent;
                });
        },
        soonAchievements() {
            return this.achievementsInOrderByProgress.slice(0, 3);
        },
        testsInTimeframe() {
            return this.tests.filter((test) => {
                return test.timestamp >= this.startOfTimeframe &&
                    test.timestamp <= this.endOfTimeframe;
            });
        },
        startOfTimeframeDatestring() {
            const d = new Date(this.startOfTimeframe);
            console.log(d);
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        },
        endOfTimeframeDatestring() {
            const d = new Date(this.endOfTimeframe);
            console.log(d);
            return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        },
        lineGraphSetups() {
            const wpmDatas = this.testsInTimeframe.map((test, i) => ({ y: test.wpm, x: i }));
            const kpmDatas = this.testsInTimeframe.map((test, i) => ({ y: test.kpm, x: i }));
            const accuracyDatas = this.testsInTimeframe.map((test, i) => ({ y: test.accuracy, x: i }));

            const datas = [ wpmDatas, kpmDatas, accuracyDatas ];
            const labels = [ 'WPM', 'KPM', 'Accuracy' ];

            return datas.map((data, i) => {
                const label = labels[i];
                const color = this.graphColors[i & this.graphColors.length];

                return {
                    title: label,
                    type: 'line',
                    data: {
                        labels: [label],
                        datasets: [
                            {
                                label: label,
                                // borderColor: 'rgb(0, 0, 0, )',
                                pointBackgroundColor: 'rgb(125, 125, 125)',
                                backgroundColor: color,
                                data,
                                lineTension: 0,
                            },
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            xAxes: [
                                { type: 'linear' },
                            ],
                            yAxes: [
                                {
                                    ticks: { beginAtZero: true },
                                },
                            ],
                        },
                    },
                };
            });
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