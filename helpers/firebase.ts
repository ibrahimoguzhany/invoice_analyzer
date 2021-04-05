import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    apiKey: "AIzaSyAMAUnaBOlpbAhFThMetX4my3S86f4KCGk",
    authDomain: "scan-receipt-demo.firebaseapp.com",
    projectId: "scan-receipt-demo",
    storageBucket: "scan-receipt-demo.appspot.com",
    messagingSenderId: "992789307085",
    appId: "1:992789307085:web:f05a4921dee5de4075d384"
};


// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const storage = app.storage();

export { storage, app as default };