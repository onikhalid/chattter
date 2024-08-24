'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

import { useAuth } from '@/contexts/userAuthContext';
import { Button, ChattterLogo, Input } from '@/components/ui';
import { FacebookIcon, GoogleIcon, SmallSpinner } from '@/components/icons';
import { auth, db } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchNotification } from '@/utils/notifications';
import { AuthLayoutHeader } from '../misc/components';
import { generateTitleSearchTerms } from '@/app/(main)/(authenticated-user)/new/misc/utils';




const registerForm = z.object({
  email: z.string({ required_error: 'Enter email.' }).email(''),
  password: z
    .string({ required_error: 'Enter password.' })
    .min(8, 'Password must be at least 8 characters')
});
type registerFormType = z.infer<typeof registerForm>


const Register: React.FC = () => {
  const { handleSubmit, register, formState: { errors, isDirty, isValid }, watch, setError, setValue } = useForm<registerFormType>({ resolver: zodResolver(registerForm) });
  const [loading, setLoading] = useState(false)

  const { register: signUp } = useAuth();
  const router = useRouter();


  const handleRegister = async (data: registerFormType) => {
    try {
      setLoading(true)
      const { email, password } = data;
      const result = await signUp(email, password)
      const user = result.user

      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (!userDocSnap.exists()) {
        const unknownUserPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/archi-nigeria.appspot.com/o/profile_pictures%2Funknown_user%2FUnknown%20Profile%20Picture.png?alt=media&token=be2b9913-ab2d-4bb3-8f7c-822e5db30009'
        await updateProfile(user, { photoURL: unknownUserPhotoURL })
        const userData = {
          id: user.uid,
          username: user.uid,
          name: user.displayName === null ? `Writer_${user.uid.substring(0, 5)}` : user.displayName,
          name_for_search: generateTitleSearchTerms(user.displayName === null ? `Writer_${user.uid.substring(0, 5)}` : user.displayName),
          avatar: user.photoURL === null ? unknownUserPhotoURL : user.photoURL,
          email: user.email,
          followers: [],
          followings: [],
          bookmarks: [],
          created_at: new Date(),
          updated_at: new Date(),
        }
        await setDoc(userDocRef, userData)
        router.push("/onboarding")
      }
      launchNotification('success', 'Welcome to Chatter 😎')

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('email', { message: 'Email already registered' })
      } else
        launchNotification('error', 'Error signing up 😪')
      console.error('Error signing up:', error)
    }
    finally {
      setLoading(false)
    }
  };


  const googleProvider = new GoogleAuthProvider();
  const GoogleSignup = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const userData = {
          uid: user.uid,
          name: user.displayName,
          username: user?.uid,
          name_for_search: generateTitleSearchTerms(user.displayName || ""),
          avatar: user.photoURL,
          email: user.email,
          followers: [],
          followings: [],
          bookmarks: [],
          created_at: new Date(),
          updated_at: new Date(),
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
      console.error(error);
    }
    finally {
      setLoading(false)
    }
  };




  return (
    <div className='bg-primary-foreground min-h-screen font-display w-full'>
      <AuthLayoutHeader />


      <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
        <header className='text-center'>
          <h1 className='font-bold font-display text-primary text-2xl'>Sign Up</h1>
          <p className='text-body'>Welcome to the Chattter Platfrom</p>
        </header>

        <form onSubmit={handleSubmit(handleRegister)} className='flex flex-col gap-6 mt-12 md:mt-16 mb-6'>
          <Input
            type="email"
            name="Email"
            placeholder="Email Address"
            value={watch('email')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('email', e.target.value.toLowerCase())}
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

          <p className='text-center text-sm max-w-[45ch] my-2 mx-auto'>
            By creating your account you agree to Chattter <span className='text-primary'>Terms of Use</span> and <span className='text-primary'>Privacy Policy</span>
          </p>


          <Button type="submit" className='w-full space-x-2 bg-[#5574FB]' size="cta" data-testid="register-button">
            Sign up
            {
              loading && <SmallSpinner />
            }
          </Button>
        </form>

        <p className='text-center mb-6 text-sm font-light'>
          &mdash; or &mdash;
        </p>

        <div className='flex flex-col lg:grid grid-cols-2 gap-3'>
          <Button variant='outline' className='flex items-center gap-2 text-body font-light' size='cta' onClick={GoogleSignup} data-testid="google-signup-button">
            <GoogleIcon />
            Google
          </Button>

          <Button variant='outline' className='flex items-center gap-2 text-body font-light' size='cta' data-testid="facebook-signup-button">
            <FacebookIcon />
            Facebook
          </Button>
        </div>

        <footer className='mt-10 md:mt-16 flex items-center justify-center gap-1.5 text-body text-sm'>
          Have an account? <Link href='/login' className='text-primary font-medium hover:underline decoration-primary decoration-[2px]'>Login</Link>
        </footer>

      </article>

    </div>
  );
};

export default Register;
