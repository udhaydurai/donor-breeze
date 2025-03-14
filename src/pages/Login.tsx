
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { currentUser, signInWithGoogle } = useAuth();

  // If already logged in, redirect to invoices page
  if (currentUser) {
    return <Navigate to="/invoices" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <img src="/lovable-uploads/4c058ff9-0116-4e6d-8c40-7bffedea0727.png" alt="Logo" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-3xl font-bold">InvoiceGen</h1>
          <p className="mt-2 text-muted-foreground">
            San Diego Tamil Sangam Invoice Generator
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Only sdts.mails@gmail.com is authorized to access this system. Please sign in with your Google account.
          </AlertDescription>
        </Alert>

        <Button 
          className="w-full flex items-center justify-center gap-2 h-12"
          variant="outline"
          size="lg"
          onClick={signInWithGoogle}
        >
          <FcGoogle className="h-5 w-5" />
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
};

export default Login;
