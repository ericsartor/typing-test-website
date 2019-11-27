<template>

    <div class="overlay" @click="startNextTest">

        <div class="window" @click.stop>

            <div>

                <h1 class="text-5xl text-center">Results</h1>

                <div class="numbers-container mb-5">

                    <div class="text-center number-stat" v-for="(value, key) in numberStats" :key="key">

                        <h2 class="text-xl">{{ key }}</h2>

                        <p>{{ value }}</p>

                    </div>

                </div>

            </div>

            <div>

                <h1 class="text-5xl text-center">Error Words</h1>

                <div class="errors-container mb-5">

                    <template v-if="words.length">
                        <p
                            v-for="word in words"
                            :key="word"
                            class="mx-5">
                            {{ word }}: {{ testResults.errorMap[word] }}
                        </p>
                    </template>

                    <p v-else class="mx-5">No words mispelled!</p>

                </div>

            </div>

            <p class="text-center">Hit enter to continue to the next test!</p>

        </div>

    </div>    

</template>

<style scoped>
.overlay {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.window {
    width: 50%;
    height: 50%;
    background: #F7F7FF;
    padding: 40px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
}

.numbers-container {
    display: flex;
    flex-flow: row nowrap;
}

.number-stat {
    width: 33.3%;
}

.errors-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
}
</style>

<script>
export default {
    // {
    //     wpm: number
    //     kpm: number,
    //     errors: number,
    //     accuracy: number,
    //     errorMap: { [word: string]: number },
    // }
    props: {
        testResults: {
            default: {
                wpm: 0,
                kpm: 0,
                errors: 0,
                accuracy: 0,
                errorMap: { word: 1, bird: 2 },
            },
        },
        startNextTest: {
            required: true,
            type: Function,
        },
    },
    computed: {
        words() {
            return Object.keys(this.testResults.errorMap);
        },
        numberStats() {
            const { accuracy, wpm, kpm, errors } = this.testResults;
            return { Accuracy: accuracy + '%', WPM: wpm, KPM: kpm, Errors: errors };
        }
    },
    beforeMount() {
        const listener = window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.startNextTest();
            } else if (event.key === ' ') {
                event.preventDefault();
            }
        });
    }
}
</script>