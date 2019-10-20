<template>
    <div class="modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Log In</h5>
                    <button type="button" class="close" @click="close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-danger mb-2" v-if="errorMessage" >{{ errorMessage }}</p>
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
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="handleLogInSubmission">Log In</button>
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