import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDmWoDNQTtbbkuKvnFdEgaH8c_bDwD21Zc",
  authDomain: "twittersentiment-6b609.firebaseapp.com",
  projectId: "twittersentiment-6b609",
  storageBucket: "twittersentiment-6b609.appspot.com",
  messagingSenderId: "743962796412",
  appId: "1:743962796412:web:54d5d369681bed4a8684f9",
  measurementId: "G-FE0FE3B3T7",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;