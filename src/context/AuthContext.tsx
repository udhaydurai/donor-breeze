
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  sendVerificationCode, 
  verifyCode, 
  isAuthenticated, 
  getCurrentUserEmail,
  signOut as firebaseSignOut
} from "../lib/firebase";

interface AuthContextType {
  currentUser: { email: string } | null;
  loading: boolean;
  sendLoginCode: (email: string) => Promise<void>;
  verifyLoginCode: (code: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    if (isAuthenticated()) {
      const email = getCurrentUserEmail();
      if (email) {
        setCurrentUser({ email });
      }
    }
    setLoading(false);
  }, []);

  const sendLoginCode = async (email: string) => {
    try {
      if (email !== "sdts.mails@gmail.com") {
        toast({
          title: "Access Denied",
          description: "Only sdts.mails@gmail.com is allowed to login.",
          variant: "destructive",
        });
        return;
      }
      
      await sendVerificationCode(email);
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code. (For demo, check the console)",
      });
    } catch (error) {
      console.error("Error sending verification code", error);
      toast({
        title: "Error",
        description: "There was a problem sending the verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyLoginCode = async (code: string) => {
    try {
      const isValid = verifyCode(code);
      
      if (isValid) {
        const email = getCurrentUserEmail();
        if (email) {
          setCurrentUser({ email });
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        return true;
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is invalid or has expired. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error verifying code", error);
      toast({
        title: "Error",
        description: "There was a problem verifying the code. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = () => {
    firebaseSignOut();
    setCurrentUser(null);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const value = {
    currentUser,
    loading,
    sendLoginCode,
    verifyLoginCode,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
