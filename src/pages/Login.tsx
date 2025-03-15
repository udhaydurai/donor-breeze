
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").refine(
    (email) => email === "sdts.mails@gmail.com",
    { message: "Only sdts.mails@gmail.com is allowed to login." }
  ),
});

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

const Login = () => {
  const { currentUser, sendLoginCode, verifyLoginCode } = useAuth();
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState("sdts.mails@gmail.com");

  const emailForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "sdts.mails@gmail.com",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  // If already logged in, redirect to invoices page
  if (currentUser) {
    return <Navigate to="/invoices" />;
  }

  const handleSendCode = async (values: z.infer<typeof loginSchema>) => {
    setEmail(values.email);
    await sendLoginCode(values.email);
    setStep('verification');
  };

  const handleVerifyCode = async (values: z.infer<typeof verificationSchema>) => {
    await verifyLoginCode(values.code);
  };

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
            Only sdts.mails@gmail.com is authorized to access this system.
          </AlertDescription>
        </Alert>

        {step === 'email' ? (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleSendCode)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="sdts.mails@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Send Verification Code</Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(handleVerifyCode)} className="space-y-4">
                <FormField
                  control={verificationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        A verification code has been sent to {email}.<br />
                        <span className="font-bold">(For demo purposes, check the browser console)</span>
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Button type="submit">Verify Code</Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setStep('email')}
                  >
                    Back to Email
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
