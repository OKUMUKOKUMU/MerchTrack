'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading: isUserLoading } = useUser();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If a user becomes authenticated while on the signup page (e.g., via Google sign-up),
    // they should be redirected to the login page. The login page contains the logic
    // to handle profile creation and redirection to the correct dashboard.
    if (!isUserLoading && user) {
        router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningUp(true);
    const provider = new GoogleAuthProvider();
    try {
      // This will trigger the onAuthStateChanged listener, and the useEffect above will handle the redirect.
      await signInWithPopup(auth, provider);
      toast({ title: "Account created successfully!" });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google Sign-Up Failed', description: error.message });
    } finally {
        setIsSigningUp(false);
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match' });
      return;
    }
    if (!firstName || !lastName || !email || !password || !phoneNumber || !employeeNumber || !idNumber) {
      toast({ variant: 'destructive', title: 'Please fill all fields' });
      return;
    }

    setIsSigningUp(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile = {
        id: user.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        employeeNumber,
        idNumber,
        role: 'merchandiser'
      };
      
      const userDocRef = doc(firestore, 'merchandisers', user.uid);
      // Wait for profile to be created before sending verification and signing out.
      await setDoc(userDocRef, userProfile, { merge: true });

      await sendEmailVerification(user);
      await signOut(auth);

      toast({ 
        title: "Account Created!",
        description: "We've sent a verification link to your email. Please check your inbox to verify your account before logging in.",
        duration: 8000,
       });

      router.push('/login');
      
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
    } finally {
      setIsSigningUp(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex justify-center items-center min-h-dvh">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-background">
        <h1 className="text-2xl font-bold text-primary font-headline mb-4 text-center">Welcome to Brown's MerchTrack Mobile</h1>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             <Button variant="outline" type="button" className="w-full" disabled={isSigningUp} onClick={handleGoogleSignIn}>
                {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177 56.5L357 154.1c-34.4-32.4-78.2-52.4-126.3-52.4-98.2 0-176.6 78.4-176.6 176.6s78.4 176.6 176.6 176.6c106.1 0 162-77.7 167.3-120.3H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>}
                Sign up with Google
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                    </span>
                </div>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" placeholder="e.g. 555-123-4567" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="employeeNumber">Employee Number</Label>
                        <Input id="employeeNumber" placeholder="EMP123" required value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="idNumber">National ID</Label>
                        <Input id="idNumber" placeholder="ID Number" required value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSigningUp}>
                    {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </form>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
