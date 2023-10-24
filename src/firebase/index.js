// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClsWts6DJsdN6SlUWGM_Miac8Ouxcw6Vg",
  authDomain: "sheals-86271.firebaseapp.com",
  projectId: "sheals-86271",
  storageBucket: "sheals-86271.appspot.com",
  messagingSenderId: "1099123454256",
  appId: "1:1099123454256:web:9685ca1c2de5c7b10718f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// init firestore service
const db = getFirestore(app);

//init storage
const storage = getStorage(app);

export {auth, db, storage}