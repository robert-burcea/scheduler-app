import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection
  } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAJTald-E-2DXQ54skxD0qNVx4a31uVsfE",
    authDomain: "scheduler-app-v2.firebaseapp.com",
    projectId: "scheduler-app-v2",
    storageBucket: "scheduler-app-v2.appspot.com",
    messagingSenderId: "10763236568",
    appId: "1:10763236568:web:215cbf88c3c0bcca0913ad",
    measurementId: "G-GPPL54CWJC"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app }
export default db;