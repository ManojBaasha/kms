// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJTxAQFBZiwppBWHV0RSaHnGBZnHbYi78",
  authDomain: "omeglebutbetter.firebaseapp.com",
  projectId: "omeglebutbetter",
  storageBucket: "omeglebutbetter.appspot.com",
  messagingSenderId: "430697048260",
  appId: "1:430697048260:web:7f5a05c6a9fa50719f4191",
  measurementId: "G-DDG1TELN2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
