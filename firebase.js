import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfb6ANOiQ0KLAEGV5MrOwJO7GW_kxDCvc",
  authDomain: "instagram-clone-cbe0b.firebaseapp.com",
  projectId: "instagram-clone-cbe0b",
  storageBucket: "instagram-clone-cbe0b.appspot.com",
  messagingSenderId: "520849155557",
  appId: "1:520849155557:web:37f201fe5297ff682f7b0c",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
const db = app.firestore();

export { auth, storage, db };
