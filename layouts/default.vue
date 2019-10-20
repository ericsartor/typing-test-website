<template>
	<div>
		<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <nuxt-link to="/" class="navbar-brand" tag="a">click clackr</nuxt-link>
            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item" v-for="page in pages"
                        :class="{ active: $route.path === page.link }"
                        :key="page.label">
                        <nuxt-link tag="a" :to="page.link" active-class="active" class="nav-link">
                            {{ page.label }}
                        </nuxt-link>
                    </li>
                </ul>
                <span class="text-light mr-5" v-if="user">Welcome back, {{ userEmailPrefix }}.</span>
                <button class="btn btn-secondary my-2 my-sm-0 mr-2" v-if="!user" @click="signUpModalOpen = true">Sign Up</button>
                <button class="btn btn-secondary my-2 my-sm-0" v-if="!user" @click="logInModalOpen = true">Log In</button>
                <button class="btn btn-secondary my-2 my-sm-0" v-if="user">Log Out</button>
            </div>
        </nav>

        <app-sign-up-modal
            v-if="signUpModalOpen"
            :sendSignUpRequest="sendSignUpRequest"
            @close="signUpModalOpen = false" />
        
        <app-log-in-modal
            v-if="logInModalOpen"
            :sendLogInRequest="sendLogInRequest"
            @close="logInModalOpen = false" />

		<nuxt />
	</div>
</template>

<script>
import SignUpModal from '~/components/SignUpModal.vue';
import LogInModal from '~/components/LogInModal.vue';

import { mapState, mapActions } from 'vuex';

export default {
    components: {
        'app-sign-up-modal': SignUpModal,
        'app-log-in-modal': LogInModal,
    },
    data() {
		return {
            pages: [
                {
                    label: 'Home',
                    link: '/',
                },
                {
                    label: 'Practice',
                    link: '/practice',
                },
                {
                    label: 'Games',
                    link: '/games',
                },
                {
                    label: 'Profile',
                    link: '/profile',
                },
            ],
            logInModalOpen: false,
            signUpModalOpen: false,
		}
    },
    computed: {
        ...mapState('user', [
            'user',
        ]),
        userEmailPrefix() {
            return this.user ? this.user.email.slice(0, this.user.email.indexOf('@')) : '[ no email ]';
        },
    },
    methods: {
        ...mapActions('user', [
            'setUser', 
        ]),
        sendLogInRequest(email, password) {
            return new Promise((resolve, reject) => {
                this.$auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(resolve)
                    .catch((error) => {
                        reject(`${error.code}: ${error.message}`);
                    });
            });
        },
        sendSignUpRequest({ email, password }) {
            return new Promise((resolve, reject) => {
                this.$auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        const user = this.$auth().currentUser;

                        user.sendEmailVerification()
                        .catch((error) => {
                            reject('Verification e-mail failed to send: ' + error.message);
                        });
                    })
                    .catch((error) => {
                        reject(error.code + ': ' + error.message);
                    });
            });
        },
    },
    beforeMount() {
        this.$auth().onAuthStateChanged((user) => {
            if (user) {
                this.setUser(user);
            } else {
                this.setUser(null);
            }
        });
    },
}
</script>
