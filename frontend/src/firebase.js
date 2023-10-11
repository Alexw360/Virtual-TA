import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAMUjTWIZ_PKqLI5PHKHYhyu5n0FlyDjSQ",
    authDomain: "virtualta-a6034.firebaseapp.com",
    projectId: "virtualta-a6034",
    storageBucket: "virtualta-a6034.appspot.com",
    messagingSenderId: "414701569632",
    appId: "1:414701569632:web:b5013989ecf290e851e505"
};

// init firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);