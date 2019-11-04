export const state = () => ({
    profile: null,
    tests: [], // these are the tests that are done while the user is not logged in
});

export const getters = {
    // gets tests from either the temporary tests array if no user logged in
    // or the logged in user's profile
    tests(state) {
        return state.profile ? state.profile.tests : state.tests;
    },
}

export const mutations = {
    // when a user logs in, log their details in the store and
    // merge any completed tests into their tests array (locally)
    setUser(state, { user, updateUserFunc }) {
        state.profile = user;

        // move the temporary tests into the user's account
        if (state.tests.length) {
            state.profile.tests.push(...state.tests);
            state.tests = [];
        }

        updateUserFunc(state.profile);
    },

    clearUser(state) {
        state.profile = null;
    },

    // push to either the temp test array if user is not logged in, or the user's test array
    // add a timestamp
    logTest(state, test) {
        test.timestamp = Date.now();
        (state.profile ? state.profile.tests : state.tests).push(test);
    },
}