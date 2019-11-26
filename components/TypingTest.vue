<template>
    <div class="typing-test" @click="focusInput">
        <app-stats-hero :wpm="wpm" :accuracy="accuracy" :kpm="kpm" :errors="errors" :time="remainingTimeString" />

        <app-typing-test-display
            v-if="textToType"
            :displayText="textToType"
            :textWrittenByUser="textWrittenByUser"
            @updatemeasurements="logMeasurements" />

        <!-- actual typing input -->
        <div class="input-container">
            <input
                type="text"
                class="user-input"
                :style="{ 'margin-left': characterWidth + 'px' }"
                placeholder="> "
                @input="handleUserInput($event)"
                v-model="textWrittenByUser"
                ref="userInput">
        </div>
    </div>
</template>

<style scoped>
.typing-test {
    box-shadow: 0 0 5px gray;
    margin-bottom: 20px;
    z-index: 0;
}

.user-input {
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: right;
    outline: none;
    font-size: 2em;
	font-family: "Ubuntu Mono";
}

.input-container {
    height: 50px;
    background: white;
    width: 100%;
    position: relative;
}
</style>

<script>
import TypingTestDisplay from './TypingTestDisplay.vue';
import StatsHero from '~/components/StatsHero.vue';

import englishWords from '../js/words';

export default {
    components: {
        'app-typing-test-display': TypingTestDisplay,
        'app-stats-hero': StatsHero,
    },
    data() {
        return {
            allottedTime: 10, // seconds
            textToType: null,
			textToTypeWords: [],
			textWrittenByUser: '',
			keystrokes: [],
			words: [],
            errorMap: {},
            characterWidth: 0,
            characterHeight: 0,
        };
    },
    watch: {
        // collapse any series of multiple spaces to a single space
        textWrittenByUser() {
            this.textWrittenByUser = this.textWrittenByUser.replace(/\s+/g, ' ');
        }
    },
	computed: {
        remainingTime() {
            return this.allottedTime - Math.floor(this.elapsedTimeMilliseconds / 1000);
        },
		currentIndex() {
			return this.textWrittenByUser.length - 1;
		},
		currentWord() {
			return this.words.find((word) => {
				return this.currentIndex >= word.start &&
					this.currentIndex < word.end;
			});
		},
		currentUserChar() {
			return this.textWrittenByUser[this.currentIndex];
		},
		currentTextChar() {
			return this.textToType[this.currentIndex];
		},
		currentCharIsCorrect() {
			return this.currentUserChar === this.currentTextChar;
		},
		accuracy() {
			return Math.round(this.numOfCorrectKeys / this.keystrokes.length * 100) || 0;
		},
		numOfPunctuation() {
			return this.words.filter((word) => word.isPunctuation).length;
		},
		numOfActualWords() {
			return this.words.filter((word) => !word.isPunctuation).length;
		},
        numOfCorrectWords() {
            let numOfCorrectWords = 0;

            // loop through words and see if the user has typed them correctly
            this.words.some((word) => {
                // skip loop if word is punctuation
                if (word.isPunctuation) {
                    return false;
                }

                // end loop if we've gone past what user has tpyed
                if (word.start >= this.textWrittenByUser.length) {
                    return true;
                }

                // get the portion of what the user has typed
                // that should correspond to the current word
                const { start, end } = word;
                const userInputSlice = this.textWrittenByUser.slice(start, end);

                numOfCorrectWords += word.word === userInputSlice;
            });

            return numOfCorrectWords;
        },
        numOfCorrectKeys() {
            return this.keystrokes.reduce((correctKeystrokes, keystroke) => {
                return correctKeystrokes + Number(keystroke.correct);
            }, 0);
        },
        numOfIncorrectKeys() {
            return this.keystrokes.reduce((correctKeystrokes, keystroke) => {
                return correctKeystrokes + Number(!keystroke.correct);
            }, 0);
        },
		elapsedTimeMilliseconds() {
			if (this.keystrokes.length === 0) {
				return 0;
			} else {
				return this.keystrokes[this.keystrokes.length - 1].timestamp - this.keystrokes[0].timestamp;
			}
        },
        remainingTimeString() {
            let seconds = this.remainingTime % 60;
            const minutes = Math.floor(this.remainingTime / 60)

            seconds = seconds < 10 ? '0' + seconds : seconds;

            return `${minutes}:${seconds}`;
        },
		wpm() {
			if (this.elapsedTimeMilliseconds === 0) {
				return 0;
			}

			const elapsedMinutes = this.elapsedTimeMilliseconds / 1000 / 60;
			return Math.round(this.numOfCorrectWords / elapsedMinutes);
		},
		kpm() {
			if (this.elapsedTimeMilliseconds === 0) {
				return 0;
			}

			const elapsedMinutes = this.elapsedTimeMilliseconds / 1000 / 60;
			return Math.round(this.numOfCorrectKeys / elapsedMinutes);
        },
        errors() {
            return Object.keys(this.errorMap).reduce((numOfErrors, wordKey) => {
                return numOfErrors + this.errorMap[wordKey];
            }, 0);
        },
        testDetails() {
            return {
                wpm: this.wpm,
                kpm: this.kpm,
                errors: this.errors,
                accuracy: this.accuracy,
                errorMap: { ...this.errorMap },
            };
        },
	},
	methods: {
        resetTest() {
            this.textToType = null;
			this.textToTypeWords = [];
			this.textWrittenByUser = '';
			this.keystrokes = [];
			this.words = [];
            this.errorMap = {};
        },
		initializeTest() {
            this.resetTest();
            
            // generate the test text to type
            const wordsToType = [];
			for (let i = 0; i < 300; i++) {
                const rand = Math.round(Math.random() * (englishWords.length - 1));
                wordsToType.push(englishWords[rand]);
            }

            const wordsAsString = wordsToType.join(' ');

			this.textToType = wordsAsString.replace(/\s+/g, ' ');
			this.words = this.parseTextWords(wordsAsString);
        },
        
        // find all the separate words/punctuation and log where they are
		parseTextWords(text) {
            // unique ids for each word
            let id = 0;
            const getId = () => id++;

			// words in this array will have punctuation attached to them if there is punctuation
			const words = text.split(' ');

			// punctuation will count as words in this array
            const wordsPunctuationSeparated = [];
            
            // utility for adding a word object to the above array that gives it an ID
            const addWord = ({ word, start, end, isPunctuation }) => {
                wordsPunctuationSeparated.push({ word, start, end, isPunctuation, id: getId() });
            };

			const punctuationRegex = /[!@#\$%\^&\*\(\)_\+-=\.\?\\\/<>:;\[\]{}\|`~]/;
			let charCounter = 0; // used to track how far into the text we are
			words.forEach((word) => {
				const firstChar = word[0];
				const lastChar = word[word.length - 1];

				let firstCharIsPunctuation = firstChar.match(punctuationRegex);
				let lastCharIsPunctuation = lastChar.match(punctuationRegex);

				if (firstCharIsPunctuation && lastCharIsPunctuation && word.length === 2) {
					// whole word is punctuation, add it as such
					addWord({
						word,
						start: charCounter,
						end: charCounter + word.length,
						isPunctuation: true,
					});

					charCounter += word.length + 1; // account for space after word
					return;
				}

				// check if first character is punctuation
				if (firstCharIsPunctuation) {
					// add punctuation at the beginning of word to array
					addWord({
						word: firstChar,
						start: charCounter,
						end: charCounter + 1,
						isPunctuation: true,
					});

					charCounter += 1; // advance past the punctuation
				}

				const actualWord = word.slice(firstCharIsPunctuation ? 1 : 0, lastCharIsPunctuation ? -1 : undefined);

				addWord({
					word: actualWord,
					start: charCounter,
					end: charCounter + actualWord.length,
					isPunctuation: false,
				});

				charCounter += actualWord.length;

				if (lastCharIsPunctuation) {
					// add punctuation at the end of word to array
					addWord({
						word: lastChar,
						start: charCounter,
						end: charCounter + 1,
						isPunctuation: true,
					});

					charCounter += 1; // advance past the punctuation
				}

				charCounter += 1; // account for the space after the word
            });
            
			return wordsPunctuationSeparated;
        },
        handleUserInput(event) {
            this.updateTextWrittenbyUser(event);
            this.checkTime();
        },
        updateTextWrittenbyUser(event) {
            // only log a keystroke if this is an input and not a backspace, delete, arrow key, etc
            if (event.data) {
                this.keystrokes.push({
                    key: event.data,
                    timestamp: performance.now(),
                    word: this.currentWord,
                    correct: this.currentCharIsCorrect,
                });
    
                this.analyzeKeystrokes();
            }
        },
        checkTime() {
            if (this.elapsedTimeMilliseconds >= this.allottedTime * 1000) {
                this.completeTest();
            }
        },
        analyzeKeystrokes() {
            const errorMap = {};
    
            let previousErrorWord = null;
    
            this.keystrokes.forEach((keystroke) => {
                let { correct, word } = keystroke;
    
                if (!word) return;
    
                const wordLower = word.word.toLowerCase();
    
                // prevent consecutive errors from counting for multiple words,
                // but allows errors if the user backspaced past the previous error word
                if (!correct && previousErrorWord && word.start >= previousErrorWord.start) return;
    
                if (!correct && wordLower !== previousErrorWord) {
                    if (errorMap[wordLower]) {
                        errorMap[wordLower]++;
                    } else {
                        errorMap[wordLower] = 1;
                    }
    
                    previousErrorWord = word;
                } else if (correct) {
                    previousErrorWord = '';
                }
            });
    
            this.errorMap = errorMap;
        },
		completeTest() {
            this.blurInput();

            const startNextTest = () => {
                this.initializeTest();
                this.focusInput();
            };

            this.$emit('testcomplete', { testResults: this.testDetails, startNextTest });
			
        },
        
        focusInput() {
            this.$refs.userInput.focus();
        },
        blurInput() {
            this.$refs.userInput.blur();
        },
        logMeasurements(measurements) {
            this.characterWidth = measurements.characterWidth;
            this.characterHeight = measurements.characterHeight;
        },
	},
	mounted() {
        this.initializeTest();
	},
}
</script>