<template>
    <div>
        <app-typing-test @testcomplete="handleTest" />
        <!-- <pre v-for="(test, i) in tests" :key="i">{{ JSON.stringify(test, undefined, 2) }}</pre> -->
        
        <h2 v-if="!profile" class="text-center mb-5">
            Log in to track your progress, earn achievements and gain access to tailored tests!
        </h2>

        <div class="chart-container" :style="{ opacity: profile ? 1 : 0.2 }">
            <app-chart v-for="(setup, i) in lineGraphSetups" :setup="setup" width="30%" :key="Date.now() + 'line' + i" />
            <app-chart :setup="wordErrorGraphSetup" width="90%" height="200" :key="Date.now() + 'bar'" />
        </div>

        <app-test-complete-complete
            v-if="testResults"
            :testResults="testResults"
            :startNextTest="startNextTest" />
    </div>
</template>

<style scoped>
.chart-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}
</style>

<script>
import TypingTest from '~/components/TypingTest.vue';
import Chart from '~/components/Chart.vue';
import TestCompleteModal from '~/components/TestCompleteModal.vue';

import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
    components: {
        'app-typing-test': TypingTest,
        'app-chart': Chart,
        'app-test-complete-complete': TestCompleteModal,
    },
    name: 'Home',
    data() {
        return {
            numOfWordsInBarChart: 20,
            graphColors: [ '#EA526F', '#3DC2F7', '#FF5714' ],
            characterWidth: 0,
            characterHeight: 0,
            testResults: null,
        };
    },
    computed: {
        ...mapState('user', [
            'profile',
        ]),
        ...mapGetters('user', [
            'tests',
        ]),
        lineGraphSetups() {
            const wpmDatas = this.tests.map((test, i) => ({ y: test.wpm, x: i }));
            const kpmDatas = this.tests.map((test, i) => ({ y: test.kpm, x: i }));
            const accuracyDatas = this.tests.map((test, i) => ({ y: test.accuracy, x: i }));

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
            const overallErrorMap = this.tests.reduce((overallErrorMap, test) => {
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
        ...mapMutations('user', [
            'logTest',
        ]),
        handleTest({ testResults, startNextTest }) {
            this.logTest(testResults);

            if (this.profile) {
                this.$db().ref('/users/' + this.profile.uid).set(this.profile);
            }

            this.testResults = testResults;
            this.startNextTest = () => {
                startNextTest();
                this.testResults = null;
            };
        },
        startNextTest() {
            this.testResults = null;
        },
    },
}
</script>
