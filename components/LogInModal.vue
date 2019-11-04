<template>
    <div class="modal">
        <h1 class="text-4xl text-left">Log In</h1>
        <hr>
        <p class="error mb-2" v-if="errorMessage" >{{ errorMessage }}</p>
        <form @submit.prevent @keydown.enter="handleLogInSubmission">
            <div class="input-group mb-2">
                <label>Email</label>
                <input type="email" v-model="email" class="mb-1" />
            </div>
            <div class="input-group mb-2">
                <label>Password</label>
                <input type="password" v-model="password" class="mb-1" />
            </div>
        </form>
        <app-button type="blue" @click="handleLogInSubmission">Log In</app-button>
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
            email: '',
            password: '',
		};
	},
	methods: {
        handleLogInSubmission() {
            this.errorMessage = '';

            this.sendLogInRequest(this.email, this.password)
                .then((response) => this.close())
                .catch((errorMessage) => this.errorMessage = errorMessage);
        },
        close() {
            this.$emit('close');
        },
	},
}
</script>