import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBwgf1ij5D0pRS6Jc30IR5ZQqyl95hvsZ8",
    authDomain: "mcqgenerator-cf6a7.firebaseapp.com",
    projectId: "mcqgenerator-cf6a7",
    storageBucket: "mcqgenerator-cf6a7.appspot.com",
    messagingSenderId: "868873159042",
    appId: "1:868873159042:web:5705928ba7d75a413e0f9b",
    measurementId: "G-XK1R8C84MD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };


