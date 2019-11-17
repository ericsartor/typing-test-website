import Achievements from '../js/achievements/Achievements';
import Vue from 'vue';

export const state = () => ({
    /*
        {
            email: string
            experiencePoints: number
            displayName: string
            tests: Test[] || undefined
            uid: string
        }
    */
    profile: null,
    achievements: null,
    tests: [], // these are the tests that are done while the user is not logged in
});

export const getters = {
    // gets tests from either the temporary tests array if no user logged in
    // or the logged in user's profile
    tests(state) {
        return state.profile ? state.profile.tests : state.tests;
    },

    displayName(state) {
        const { profile } = state;
        
        return profile ? 
            profile.displayName || profile.email.slice(0, profile.email.indexOf('@')) :
            null;
    }
}

export const mutations = {
    // when a user logs in, log their details in the store and
    // merge any completed tests into their tests array (locally)
    setUser(state, { profile }) {
        state.profile = profile;

        // move the temporary tests into the user's account
        if (state.tests.length) {
            state.profile.tests.push(...state.tests);
            state.tests = [];
        }

        // update user in Firebase
        Vue.prototype.$db().ref('/users/' + state.profile.uid).set(state.profile);

        state.achievements = new Achievements({ profile: state.profile });
    },

    clearUser(state) {
        state.profile = null;
        state.achievements = null;
    },

    // push to either the temp test array if user is not logged in, or the user's test array
    // add a timestamp
    logTest(state, test) {
        test.timestamp = Date.now();
        (state.profile ? state.profile.tests : state.tests).push(test);
    },
}

