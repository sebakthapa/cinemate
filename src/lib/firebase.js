// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv0Jt5_G5XVyWLv2-A6jExRkUwtRzmqmg",
    authDomain: "netflix-clone-3c1dd.firebaseapp.com",
    projectId: "netflix-clone-3c1dd",
    storageBucket: "netflix-clone-3c1dd.appspot.com",
    messagingSenderId: "208354357492",
    appId: "1:208354357492:web:2085b6458ca8701ab8aea1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)