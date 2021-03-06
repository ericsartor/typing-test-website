<template>
    <div class="modal-container">
        <div class="modal">
            <h1 class="text-4xl">Sign Up</h1>
            <hr>
            <p class="error mb-2" v-if="errorMessage" >{{ errorMessage }}</p>
            <p class="success mb-2" v-if="successMessage" >{{ successMessage }}</p>
            <form @submit.prevent @keydown.enter="handleSignUpSubmission">
                <div class="input-group mb-2">
                    <label>Email</label>
                    <input type="email" v-model="email" class="mb-1" />
                    <span
                        class="input-error error"
                        v-if="!emailIsValid">
                        Email should be 100 characters or less and contain an "@" and ".".
                    </span>
                </div>
                <div class="input-group mb-2">
                    <label>Display Name</label>
                    <input type="text" v-model="displayName" class="mb-1" />
                    <span
                        class="input-error error"
                        v-if="!displayNameIsValid">
                        Display name should be 20 characters or less and contain only letters, nubmers, _ and -.
                    </span>
                </div>
                <div class="input-group mb-2">
                    <label>Password</label>
                    <input type="password" v-model="password" class="mb-1" />
                    <span
                        class="input-error error"
                        v-if="!passwordIsValid">
                        Password should be at least {{ passwordCharacterMinimum }} characters.
                    </span>
                </div>
                <div class="input-group mb-2">
                    <label>Confirm Password</label>
                    <input type="password" v-model="confirmPassword" class="mb-1" />
                    <span
                        class="input-error error"
                        v-if="!passwordsMatch">
                        Passwords do not match.
                    </span>
                </div>
            </form>
            <app-button type="blue" @click="handleSignUpSubmission">Sign Up</app-button>
            <app-button @click="close">Close</app-button>
        </div>
    </div>
</template>

<script>
import Button from '~/components/Button.vue';

export default {
    components: {
        'app-button': Button,
    },
    props: {
        sendSignUpRequest: {
            required: true,
            type: Function,
        },
    },
    data() {
		return {
            errorMessage: '',
            successMessage: '',

            // form values
            email: '',
            displayName: '',
            password: '',
            confirmPassword: '',

            // character limits/minimums
            emailCharacterLimit: 100,
            displayNameCharacterLimit: 20,
            passwordCharacterMinimum: 8,
		};
	},
	computed: {
        emailIsValid() {
            return this.email.length <= this.emailCharacterLimit && this.email.match(/.+@.+\..+/);
        },
        displayNameIsValid() {
            return this.displayName.length > 0 &&
                this.displayName.length <= this.displayNameCharacterLimit &&
                !this.displayName.match(/[^a-zA-Z0-9\-\_]/);
        },
        passwordIsValid() {
            return this.password.length >= this.passwordCharacterMinimum;
        },
        passwordsMatch() {
            return this.password === this.confirmPassword;
        },
        signUpDetailsAreValid() {
            return this.emailIsValid && this.passwordIsValid && this.passwordsMatch;
        },
	},
	methods: {
        handleSignUpSubmission() {
            this.errorMessage = '';

            if (!this.signUpDetailsAreValid) {
                this.errorMessage = 'Some of your sign up details do meet the requirements.';
                return;
            }

            const props = { email: this.email, password: this.password, displayName: this.displayName };

            this.sendSignUpRequest(props)
                .then(() => this.successMessage = 'Success!  An e-mail has ben sent to the address provided for validation.')
                .catch((error) => this.errorMessage = error);
        },
        completeSignUp() {
            this.$emit('signupcomplete');
        },
        close() {
            this.$emit('close');
        },
	},
}
</script>