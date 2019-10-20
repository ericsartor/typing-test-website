import Vue from 'vue';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDBQ8DzyYkQ8VhulEIB874rDSVBIggVFd4",
    authDomain: "clickclack-f540e.firebaseapp.com",
    databaseURL: "https://clickclack-f540e.firebaseio.com",
    projectId: "clickclack-f540e",
    storageBucket: "clickclack-f540e.appspot.com",
    messagingSenderId: "323943794688",
    appId: "1:323943794688:web:33e4192f508a51065630e5",
    measurementId: "G-K0QRZQV0Y8"
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : null;

Vue.prototype.$auth = firebase.auth;