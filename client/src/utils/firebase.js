




import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviq-ce785.firebaseapp.com",
  projectId: "interviq-ce785",
  storageBucket: "interviq-ce785.firebasestorage.app",
  messagingSenderId: "846111583337",
  appId: "1:846111583337:web:c7110a2dafff9cf83686f8"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app)


const provider = new GoogleAuthProvider

export {auth,provider}


