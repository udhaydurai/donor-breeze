
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUNTVZGkJVQwfAP_IyC5u4Qf8-fHCNmSA",
  authDomain: "invoice-generator-sdts.firebaseapp.com",
  projectId: "invoice-generator-sdts",
  storageBucket: "invoice-generator-sdts.appspot.com",
  messagingSenderId: "624791172891",
  appId: "1:624791172891:web:d2c5f5b3f3f3f3f3f3f3f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
