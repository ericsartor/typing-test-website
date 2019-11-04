<template>
    <div class="Text-Display">

			<!-- overlay mode toggle -->
            <!-- <div class="overlay-mode-button-container">
                <app-button
                    :type="overlayMode ? 'pink' : 'none'"
                    @click="toggleOverlayMode">Overlay Mode</app-button>
            </div> -->

			<div
                class="character-container"
                ref="characterContainer"
                :style="{ 'padding-bottom': !overlayMode ? `${spanHeight}px` : '' }">

				<!-- overlay mode container -->
				<div class="overlay-mode-container" v-if="overlayMode">
					<div class="displayCharacters">
						<span
							v-for="(char, i) in textCharactersToPrint"
							:class="{ 'hidden-char': i < (textCharactersToPrint.length / 2 + 1) }"
                            v-html="parseChar(char)"
                            :key="i" />
					</div>
					<div class="userCharacters">
						<span
							v-for="(char, i) in userCharactersToPrint"
							:class="determineUserCharacterClass(char, i)"
                            v-html="parseChar(char)"
                            :key="i" />
					</div>

                    <!-- the above elements are absolutely positioned, so this element secretly
                         takes up the required space for them in the flow of the page -->
					<div class="text-content-for-sizing">{{ displayText }}</div>
				</div>

				<!-- regular mode container -->
				<div class="non-overlay-mode" v-else>

					<!-- container for characters the user needs to type -->
					<div class="displayCharacters">

						<!-- characters the user needs to type -->
						<span
                            v-for="(char, i) in textCharactersToPrint"
                            v-html="parseChar(char)"
                            :key="i" />

					</div>

					<!-- container for characters user has typed -->
					<div class="userCharacters" :style="{ 'top': !overlayMode ? `${spanHeight}px` : '' }">

						<!--  characters the user has typed -->
						<span
							v-for="(char, i) in userCharactersToPrint"
							:class="determineUserCharacterClass(char, i)"
                            v-html="parseChar(char)"
                            :key="i" />

					</div>

				</div>

                <span style="visibility: hidden;" ref="measurementSpan">_</span>

			</div>

		</div>
</template>

<style scoped>
.Text-Display {
    background-color: white;
}

.character-container {
    position: relative;
    width: 100%;
	font-family: "Ubuntu Mono";
    font-weight: normal;
    font-size: 2em;
}

.displayCharacters, .userCharacters {
    position: absolute;
}

.displayCharacters {
	color: black;
}
.overlay-mode-container .displayCharacters {
	opacity: 0.3;
}
.displayCharacters span.hidden-char {
    visibility: hidden;
}

.userCharacters {
	color: #006400;
}
.userCharacters span.wrong {
	color: red;
}
.userCharacters span.wrong.space {
	background-color: red;
}

.text-content-for-sizing {
    visibility: hidden;
    white-space: nowrap;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
}

.overlay-mode-button-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
}
</style>

<script>
import Button from '~/components/Button.vue';

export default {
    components: {
        'app-button': Button,
    },
    props: {
		displayText: {
			type: String,
			required: true,
		},
		textWrittenByUser: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
            overlayMode: true,
            spanWidth: 0,
            spanHeight: 0,
            characterContainerWidth: 0,
		};
    },
	computed: {
		textCharacters() {
			return this.displayText.split('');
		},
		userCharacters() {
			return this.textWrittenByUser.split('');
        },
        numOfCharactersToPrint() {
            if (this.spanWidth && this.characterContainerWidth) {
                return Math.floor(this.characterContainerWidth / this.spanWidth);
            } else {
                return 0;
            }
        },
        textCharactersToPrint() {
            const numOfTypedCharacters = this.userCharacters.length;
            const startIndex = -Math.floor(this.numOfCharactersToPrint / 2) + numOfTypedCharacters - 1;
            const endIndex = startIndex + this.numOfCharactersToPrint;

            const charactersToPrint = [];

            for (let i = startIndex; i < endIndex; i++) {
                if (i >= this.textCharacters.length) {
                    break;
                } else if (i < 0) {
                    charactersToPrint.push(' ');
                } else {
                    charactersToPrint.push(this.textCharacters[i]);
                }
            }

            return charactersToPrint;
        },
        userCharactersToPrint() {
            const numOfTypedCharacters = this.userCharacters.length;
            const startIndex = numOfTypedCharacters - Math.floor(this.numOfCharactersToPrint / 2) - 1;
            const endIndex = startIndex + this.numOfCharactersToPrint;

            const charactersToPrint = [];

            for (let i = startIndex; i < endIndex; i++) {
                if (i >= this.userCharacters.length) {
                    break;
                } else if (i < 0) {
                    charactersToPrint.push(' ');
                } else {
                    charactersToPrint.push(this.userCharacters[i]);
                }
            }

            return charactersToPrint;
        },
	},
	methods: {
        parseChar(char) {
            return char === ' ' ? '&nbsp;' : char;
        },
		determineUserCharacterClass(char, i) {
			const correctChar = this.textCharactersToPrint[i];

			const isCorrect = char === correctChar;

			return {
				wrong: !isCorrect,
				space: char === ' ',
			};
		},
		toggleOverlayMode() {
			this.overlayMode = !this.overlayMode;
        },
        updateMeasurements() {
            this.spanWidth = this.$refs.measurementSpan.getBoundingClientRect().width;
            this.spanHeight = this.$refs.measurementSpan.getBoundingClientRect().height;
            this.characterContainerWidth = this.$refs.characterContainer.getBoundingClientRect().width;

            this.$emit('updatemeasurements', {
                characterWidth: this.spanWidth,
                characterHeight: this.spanHeight,
            });
        }
    },
    mounted() {
        this.updateMeasurements();

        window.addEventListener('resize', () => this.updateMeasurements());
    }
}
</script>