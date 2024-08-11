'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

import { useAuth } from '@/contexts/userAuthContext';
import { Button, ChattterLogo, Input } from '@/components/ui';
import { FacebookIcon, GoogleIcon, SmallSpinner } from '@/components/icons';
import { auth, db } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchNotification } from '@/utils/notifications';
import { AuthLayoutHeader } from '../misc/components';



const LoginForm = z.object({
    email: z.string({ required_error: 'Enter email' }).email({ message: 'Enter valid email address' }),
    password: z
        .string({ required_error: 'Enter password.' })
        .min(8, 'Password must be at least 8 characters')
});
type LoginFormType = z.infer<typeof LoginForm>


const Login: React.FC = () => {
    const { handleSubmit, register, formState: { errors, isDirty, isValid }, watch, setError, setValue } = useForm<LoginFormType>({ resolver: zodResolver(LoginForm) });

    const { login: signIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleLogin = async (data: LoginFormType) => {
        try {
            setLoading(true)
            const { email, password } = data;
            const user = await signIn(email, password)

            const userDocRef = doc(db, 'users', user.user.uid)
            const userDocSnap = await getDoc(userDocRef)

            const userData = userDocSnap.data()
            await updateProfile(user.user, { displayName: `Writer ${user.user.uid.substring(0, 8)}` })
            await updateDoc(userDocRef, { lastLogin: new Date() })

            if (userData?.hasOwnProperty('username')) {
                router.push('/')
            }
            else {
                router.push('/onboarding')
            }
            launchNotification('success', 'Logged in successfully 😎')
        }

        catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                setError('email', {
                    type: 'manual',
                    message: 'Email not found'
                })
            } else if (error.code === 'auth/wrong-password') {
                setError('password', {
                    type: 'manual',
                    message: 'Invalid Password'
                })
            }
            else if (error.code === 'auth/invalid-credential') {
                setError('email', {
                    type: 'manual',
                    message: 'Invalid credentials'
                })
                setError('password', {
                    type: 'manual',
                    message: 'Invalid credentials'
                })
            }

            else {
                launchNotification('error', 'Error Logging in 😪')
                console.log('Error logging in:', error);
            }
        }
        finally {
            setLoading(false)
        }
    };


    const googleProvider = new GoogleAuthProvider();
    const GoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log(result)
            const user = result.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                const userData = {
                    uid: user.uid,
                    name: user.displayName,
                    avatar: user.photoURL
                }
                await setDoc(userDocRef, userData)
                router.push("/onboarding");
            }
            else if (userDocSnap.exists()) {
                const data = userDocSnap.data()
                if (data.hasOwnProperty('username')) {
                    router.push('/')
                    // router.back()
                } else {
                    router.push('/onboarding')
                }
            }
        } catch (error: any) {
            if (error.code || error.message === "auth/popup-blocked") {
                launchNotification('error', 'Signup Popup blocked')
            } else {

            }
            console.log(error);
        }
    };




    return (
        <div className='bg-primary-foreground min-h-screen font-display w-full'>
            <AuthLayoutHeader />


            <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
                <header className='text-center'>
                    <h1 className='font-bold font-display text-primary text-2xl'>Login</h1>
                    <p className='text-body'>Welcome Back 🤝</p>
                </header>

                <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-6 mt-12 md:mt-16 mb-6'>
                    <Input
                        type="email"
                        placeholder="Email Address"
                        {...register('email')}
                        className='3.875rem'
                        hasError={!!errors.email}
                        errorMessage={errors.email?.message}
                        data-testid="email-input"
                    />


                    <Input
                        type="password"
                        placeholder="Create Password"
                        className='3.875rem'
                        {...register('password')}
                        hasError={!!errors.password}
                        errorMessage={errors.password?.message}
                        data-testid="password-input"
                    />

                    <p className='text-right text-sm my-2 ml-auto'>
                        Forgot password?
                    </p>


                    <Button type="submit" className='flex items-center gap-2 w-full space-x-2 bg-[#5574FB]' size="cta" data-testid="login-button">
                        Login
                        {
                            loading && <SmallSpinner className='text-primary' />
                        }
                    </Button>
                </form>

                <p className='text-sm text-muted-foreground text-center mb-6'>
                    &mdash;&mdash; or &mdash;&mdash;
                </p>

                <div className='flex flex-col lg:grid grid-cols-2 gap-3'>
                    <Button variant='outline' className='flex items-center gap-2 text-muted-foreground' size='cta' onClick={GoogleSignup}>
                        <GoogleIcon />
                        Google
                    </Button>

                    <Button variant='outline' className='flex items-center gap-2 text-muted-foreground' size='cta'>
                        <FacebookIcon />
                        Facebook
                    </Button>
                </div>

                <footer className='mt-10 md:mt-16 flex items-center justify-center gap-1.5 text-muted-foreground text-sm'>
                    No account? <Link href='/register' className='text-primary font-medium hover:underline decoration-primary decoration-[2px]'>Sign up</Link>
                </footer>

            </article>

        </div>
    );
};

export default Login;
