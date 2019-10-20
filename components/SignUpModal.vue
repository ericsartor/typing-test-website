<template>
    <div class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sign Up</h5>
                    <button type="button" class="close" @click="close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-danger mb-2" v-if="errorMessage" >{{ errorMessage }}</p>
                    <p class="text-success mb-2" v-if="successMessage" >{{ successMessage }}</p>
                    <form @submit.prevent @keydown.enter="handleSignUpSubmission">
                        <div class="input-group mb-2">
                            <label>Email</label>
                            <input type="email" v-model="email" class="mb-1" />
                            <span
                                class="input-error text-danger"
                                v-if="!emailIsValid">
                                Email should be 100 characters or less and contain an "@" and ".".
                            </span>
                        </div>
                        <div class="input-group mb-2">
                            <label>Password</label>
                            <input type="password" v-model="password" class="mb-1" />
                            <span
                                class="input-error text-danger"
                                v-if="!passwordIsValid">
                                Password should be at least {{ passwordCharacterMinimum }} characters.
                            </span>
                        </div>
                        <div class="input-group">
                            <label>Confirm Password</label>
                            <input type="password" v-model="confirmPassword" class="mb-1" />
                            <span
                                class="input-error text-danger"
                                v-if="!passwordsMatch">
                                Passwords do not match.
                            </span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="handleSignUpSubmission">Sign Up</button>
                    <button type="button" class="btn btn-secondary" @click="close">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.input-group {
    display: flex;
    flex-flow: column nowrap;
}

.input-group .input-error {
    font-size: 0.7em;
}

.modal {
    display: block;
}
</style>

<script>
export default {
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
            password: '',
            confirmPassword: '',

            // character limits/minimums
            emailCharacterLimit: 100,
            passwordCharacterMinimum: 8,
		};
	},
	computed: {
        emailIsValid() {
            return this.email.length <= this.emailCharacterLimit && this.email.match(/.+@.+\..+/);
        },
        passwordIsValid() {
            return this.password.length >= this.passwordCharacterMinimum;
        },
        passwordsMatch() {
            return this.password === this.confirmPassword;
        },
	},
	methods: {
        signUpDetailsAreValid() {
            return this.emailIsValid && this.passwordIsValid && this.passwordsMatch;
        },
        handleSignUpSubmission() {
            this.errorMessage = '';

            if (!this.signUpDetailsAreValid) {
                this.errorMessage = 'Some of your sign up details do meet the requirements.'
                return;
            }

            this.sendSignUpRequest({ email: this.email, password: this.password })
                .then(() => this.successMessage = 'Success!  An e-mail has ben sent to the address rovided for validation.')
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