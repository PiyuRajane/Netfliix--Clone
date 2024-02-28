// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyAhm33n0jv-uABP_oLq8pTFjRBogf1ublA",
  authDomain: "react-netflix-clone-e1d1a.firebaseapp.com",
  projectId: "react-netflix-clone-e1d1a",
  storageBucket: "react-netflix-clone-e1d1a.appspot.com",
  messagingSenderId: "29407198890",
  appId: "1:29407198890:web:20228996e467d70cdcdad3",
  measurementId: "G-RH9H4TCPD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);