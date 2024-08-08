'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

import { Button, ChatterLogo, Input } from '@/components/ui';
import { FacebookIcon, GoogleIcon, SmallSpinner } from '@/components/icons';
import { auth, db } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchNotification } from '@/utils/notifications';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AuthLayoutHeader } from '../misc/components';



const OnboardingForm = z.object({
    username: z.string({ required_error: 'Enter username' }),
    tags: z.array(z.string()).min(3, { message: 'Please select at least three interest' }),
    bio: z.string({ required_error: 'Enter bio' }).min(20, { message: 'Bio must be at least 20 characters' }),

});
type OnboardingFormType = z.infer<typeof OnboardingForm>


const Login: React.FC = () => {
    const { handleSubmit, register, formState: { errors, isDirty, isValid }, watch, setError, setValue } = useForm<OnboardingFormType>({ resolver: zodResolver(OnboardingForm) });
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (data: OnboardingFormType) => {
        try {
            setIsLoading(true)
            const { username, tags } = data;

            const userDocRef = doc(db, 'users', user?.uid || '')
            const userDocSnap = await getDoc(userDocRef)

            const userData = userDocSnap.data()


            if (userData?.hasOwnProperty('username')) {
                router.push('/')
            }
            else {
                router.push('/auth/complete-profile')
            }
            launchNotification('success', 'Logged in successfully 😎')
        }

        catch (error: any) {
           if(error.code === 'auth/user-not-found'){
           }
            else {
                launchNotification('error', 'Error Logging in 😪')
                console.log('Error logging in:', error);
            }
        }
        finally {
            setIsLoading(false)
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
                    id: user.uid,
                    name: user.displayName,
                    profilePicture: user.photoURL
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
                    router.push('/auth/complete-profile')
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
                        type="text"
                        placeholder="Choose username"
                        {...register('username')}
                        className='3.875rem'
                        hasError={!!errors.username}
                        errorMessage={errors.username?.message}
                    />


                    <Input
                        type="password"
                        placeholder="Create Password"
                        className='3.875rem'
                        {...register('bio')}
                        hasError={!!errors.bio}
                        errorMessage={errors.bio?.message}
                    />

                    <p className='text-right text-sm my-2 ml-auto'>
                        Forgot password?
                    </p>


                    <Button type="submit" className='w-full space-x-2 bg-[#5574FB]' size="cta">
                        Login
                        {
                            isLoading && <SmallSpinner />
                        }
                    </Button>
                </form>

                <p className='text-center mb-6 text-sm font-light'>
                    &mdash; or &mdash;
                </p>

                <div className='flex flex-col lg:grid grid-cols-2 gap-3'>
                    <Button variant='outline' className='flex items-center gap-2 text-body' size='cta' onClick={GoogleSignup}>
                        <GoogleIcon />
                        Google
                    </Button>

                    <Button variant='outline' className='flex items-center gap-2 text-body' size='cta'>
                        <FacebookIcon />
                        Facebook
                    </Button>
                </div>

                <footer className='mt-10 md:mt-16 flex items-center justify-center gap-1.5 text-body text-sm'>
                    No account? <Link href='/register' className='text-primary font-medium hover:underline decoration-primary decoration-[2px]'>Sign up</Link>
                </footer>

            </article>

        </div>
    );
};

export default Login;
