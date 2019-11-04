<template>
	<div>
		<nav>
            <div class="logo">
                <nuxt-link to="/" tag="a">click clackr</nuxt-link>
            </div>
            <div>
                <ul>
                    <li
                        class="mr-2"
                        v-for="page in pages"
                        :class="{ active: $route.path === page.link }"
                        :key="page.label">
                        <nuxt-link tag="a" :to="page.link" active-class="active">
                            {{ page.label }}
                        </nuxt-link>
                    </li>
                </ul>
            </div>
            <div class="account-buttons">
                <app-button class="mr-3" type="blue" v-if="profile" @click="sendSignOutRequest">Log Out</app-button>
                <app-button class="mr-3" type="blue" v-if="!profile" @click="logInModalOpen = true">Log In</app-button>
                <app-button class="mr-3" type="pink" v-if="!profile" @click="signUpModalOpen = true">Sign Up</app-button>
                <span class="mr-5" v-if="profile">Welcome back, {{ userEmailPrefix }}.</span>
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

<style scoped>
nav {
    --nav-height: 80px;
    margin: 0;
    padding: 0;
    background-color: #070600;
    width: 100%;
    height: var(--nav-height);
    display: grid;
    grid-template-rows: var(--nav-height);
    grid-template-columns: 200px 1fr 1fr;
    overflow: hidden;
    color: #F7F7FF;
}

nav > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.account-buttons {
    flex-direction: row-reverse;
}

nav ul {
    display: flex;
    flex-flow: row nowrap;
    list-style: none;
    margin: 0;
    padding: 0;
}

nav ul li {
    opacity: 0.5;
    transition: all 0.2s;
}

nav ul li.active, nav ul li:hover {
    opacity: 1;
}

nav a {
    color: #F7F7FF;
    text-decoration: none;
}

.logo a {
    margin: 0 auto;
    font-family: 'Sniglet';
    font-weight: bold;
    font-size: 2em;
    transition: all 0.2s;
}

.logo a:hover {
    letter-spacing: 2px;
}
</style>

<script>
import Button from '~/components/Button.vue';
import SignUpModal from '~/components/SignUpModal.vue';
import LogInModal from '~/components/LogInModal.vue';

import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    components: {
        'app-button': Button,
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
            'profile',
        ]),
        userEmailPrefix() {
            return this.profile ? this.profile.email.slice(0, this.profile.email.indexOf('@')) : '[ no email ]';
        },
    },
    methods: {
        ...mapMutations('user', [
            'setUser',
            'clearUser',
        ]),
        sendLogInRequest(email, password) {
            return new Promise((resolve, reject) => {
                this.$auth()
                    .signInWithEmailAndPassword(email, password)
                    .then((response) => {
                        const { user } = response;

                        if (user.emailVerified) {
                            resolve();
                        } else {
                            throw {
                                code: 'email-not-verified',
                                message: 'You have not clicked the confirmation link emailed to you during signup.  Check your inbox/junk folders!',
                            };
                        }
                    })
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
                        .then(resolve)
                        .catch((error) => {
                            reject('Verification e-mail failed to send: ' + error.message);
                        });

                        this.$db()
                            .ref('users/' + user.uid).set({
                                email: user.email,
                                tests: [],
                                experiencePoints: 0,
                            });
                    })
                    .catch((error) => {
                        reject(error.code + ': ' + error.message);
                    });
            });
        },
        sendSignOutRequest() {
            this.$auth().signOut();
            this.clearUser();
        },
    },
    beforeMount() {
        this.$auth()
            .onAuthStateChanged((user) => {
                if (user && user.emailVerified) {
                    this.$db().ref('/users/' + user.uid).once('value').then((snapshot) => {
                        if (snapshot.val()) {
                            let { email, tests, experiencePoints, achievements } = snapshot.val();

                            if (!Array.isArray(tests)) {
                                tests = Object.values(tests)
                                    .sort((testA, testB) => {
                                        return testB.timestamp - testA.timestamp;
                                    });
                            }

                            // set the user locally, then update the database after folding in any
                            // temporary tests that were completed before logging in
                            this.setUser({
                                user: {
                                    uid: user.uid, 
                                    email,
                                    tests: tests || [],
                                    experiencePoints: experiencePoints || 0,
                                    achievements: achievements || [],
                                },
                                updateUserFunc: (userUpdate) => {
                                    this.$db().ref('/users/' + user.uid).set(userUpdate);
                                }
                            });
                        }
                    });

                } else {
                    this.clearUser();
                }
            });
    },
}
</script>
