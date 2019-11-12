<template>
    <div class="modal">
        <h1 class="text-4xl text-left">Log In</h1>
        <hr>
        <p class="error mb-2" v-if="errorMessage" >{{ errorMessage }}</p>
        <p class="success mb-2" v-if="successMesage" >{{ successMesage }}</p>
        <form @submit.prevent @keydown.enter="handleLogInFormSubmission">
            <div class="input-group mb-2">
                <label>Email</label>
                <input type="email" v-model="email" class="mb-1" />
            </div>
            <div class="input-group mb-2" v-if="!forgotPassword">
                <label>Password</label>
                <input type="password" v-model="password" class="mb-1" />
            </div>
        </form>
        <a @click.prevent="handleForgotPassword" href="" class="mb-2 block">
            {{ this.forgotPassword ? '< I Remembered!' : 'Forgot Password?' }}
        </a>
        <app-button
            v-if="!forgotPassword"
            type="blue"
            @click="handleLogInSubmission">Log In</app-button>
        <app-button
            v-else
            type="blue"
            @click="handleResetPassword">Reset Password</app-button>
        <app-button @click="close">Close</app-button>
    </div>
</template>

<script>
import Button from '~/components/Button.vue';

export default {
    components: {
        'app-button': Button,
    },
    props: {
        sendLogInRequest: {
            required: true,
            type: Function,
        },
    },
    data() {
		return {
            errorMessage: '',
            successMesage: '',
            email: '',
            password: '',
            forgotPassword: false,
		};
	},
	methods: {
        resetMessages() {
            this.errorMessage = '';
            this.successMesage = '';
        },
        handleLogInSubmission() {
            this.resetMessages();

            this.sendLogInRequest(this.email, this.password)
                .then((response) => this.close())
                .catch((errorMessage) => this.errorMessage = errorMessage);
        },
        handleForgotPassword() {
            this.forgotPassword = !this.forgotPassword;
        },
        handleResetPassword() {
            this.resetMessages();

            this.$auth()
                .sendPasswordResetEmail(this.email)
                    .then(() => {
                        this.successMesage = 'Success!  A password reset e-mail has been sent to ' +
                            this.email;
                    })
                    .catch((error) => {
                        this.errorMessage = error.code + ': ' + error.message;
                    });
        },
        handleLogInFormSubmission() {
            if (this.forgotPassword) {
                this.handleResetPassword();
            } else {
                this.handleLogInSubmission();
            }
        },
        close() {
            this.$emit('close');
        },
	},
}
</script>