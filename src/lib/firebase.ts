
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// In a real application, this would be a backend API call
export const sendVerificationCode = async (email: string): Promise<string> => {
  if (email !== "sdts.mails@gmail.com") {
    throw new Error("Unauthorized email address");
  }
  
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // In a real app, we would send this code via email
  console.log(`[SIMULATED] Sending verification code ${code} to ${email}`);
  
  // Store the code and expiration time in localStorage (in a real app, this would be server-side)
  const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutes
  localStorage.setItem('verificationCode', code);
  localStorage.setItem('verificationExpiration', expirationTime.toString());
  localStorage.setItem('verificationEmail', email);
  
  return code;
};

// Verify the code
export const verifyCode = (code: string): boolean => {
  const storedCode = localStorage.getItem('verificationCode');
  const expirationTime = Number(localStorage.getItem('verificationExpiration') || '0');
  const email = localStorage.getItem('verificationEmail');
  
  // Check if code is valid and not expired
  if (storedCode === code && new Date().getTime() < expirationTime && email === "sdts.mails@gmail.com") {
    // Clear verification data
    localStorage.removeItem('verificationCode');
    localStorage.removeItem('verificationExpiration');
    
    // Set user as authenticated
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    return true;
  }
  
  return false;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};

export const signOut = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
};
