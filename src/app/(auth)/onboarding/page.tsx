'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z, ZodError } from 'zod';
import { getDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

import { Button, FormError, Input, Label, LoadingModal, TagInput, Textarea } from '@/components/ui';
import { SmallSpinner, TrashIcon, UploadIcon } from '@/components/icons';
import { auth, db, } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayoutHeader } from '../misc/components';
import { presetArticleTags } from '@/constants';
import { TUser } from '@/contexts';
import { cn } from '@/lib/utils';

import { useUpdateUserProfile } from '../misc/api';
import { TUpdateUser } from '../misc/types';
import { generateTitleSearchTerms } from '@/app/(main)/(authenticated-user)/new/misc/utils';
import { checkIfUsernameTaken } from '../misc/utils';






const NewUserOnboarding: React.FC = () => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [profileImgURL, setProfileImgURL] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const OnboardingForm = z.object({
        name: z.string({ required_error: 'Enter your name' }).min(3, { message: 'Name must be at least 3 characters' }),
        username: z.string({ required_error: 'Enter username' }).min(5, { message: 'Username must be at least 5 characters' }),
        interests: z.array(z.string()).min(3, { message: 'Please select at least three interest' }),
        bio: z.string({ required_error: 'Enter bio' }).min(20, { message: 'Bio must be at least 20 characters' }),
        twitter: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        avatar: z.any().nullable().refine(
            file => {
                if (!userData?.avatar && !file) {
                    throw ZodError.create([{
                        path: ['avatar'],
                        message: 'Please select a profile image.',
                        code: 'custom',
                    }]);
                }
                if (file && !file.type.startsWith('image/')) {
                    throw ZodError.create([{
                        path: ['avatar'],
                        message: 'Please select a valid image file.',
                        code: 'custom',
                    }]);
                }
                if (file) {
                    return file?.size <= 10000000
                }
                else {
                    return !!userData?.avatar
                }
            },

            {
                message: 'Max image size is 10MB.',
            }
        ),
    });
    const { handleSubmit, register, formState: { errors, isDirty, isValid }, control, watch, setError, setValue, getValues } = useForm<TUpdateUser>({
        resolver: zodResolver(OnboardingForm)
    });

    useEffect(() => {
        if (!loading && user) {
            const userDocRef = doc(db, `users/${user?.uid}`);
            const getUserData = async () => {
                const userDocSnap = await getDoc(userDocRef);
                const userData = userDocSnap.data() as TUser;
                setUserData(userData)

                if (userData) {
                    setValue('name', userData.name || '')
                    setValue('username', userData.username || '')
                    setValue('bio', userData.bio || '')
                    setValue('interests', userData.interests || [])
                    setValue('twitter', userData.twitter || '')
                    setValue('facebook', userData.facebook || '')
                    setValue('linkedin', userData.linkedin || '')
                    setValue('instagram', userData.instagram || '')
                    setProfileImgURL(userData.avatar || null)
                }
            }
            getUserData()
        }
    }, [user, loading, setValue])



    const updateUserProfileMutation = useUpdateUserProfile({ user: user!, selectedImage, profileImgURL: profileImgURL! });
    const handleUpdateProfile = async (data: TUpdateUser) => {
        if (!loading && !user) {
            toast.error("Login to update profile")
            return
        }
        const validUsername = await checkIfUsernameTaken({ username: data.username, user: user! });
        if (!validUsername) {
            setError('username', { message: 'Username already taken' })
            return
        }

        try {
            await updateUserProfileMutation.mutateAsync({ ...data, updated_at: new Date(), name_for_search: generateTitleSearchTerms(data.name) },
                {
                    onSuccess(data, variables, context) {
                        toast.success("Profile updated successfully", {
                            position: "top-center",
                            duration: 2000,
                        });
                        router.push(`/`);
                    },
                }
            );

        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile", {
                position: "top-center",
                duration: 2000,
            });
        }
    };


    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        setSelectedImage(file);
        const newImgURL = URL.createObjectURL(file)
        setProfileImgURL(newImgURL)
    };



    return (
        <div className='bg-primary-foreground min-h-screen font-display w-full overflow-y-scroll pb-5 overflow-y-scroll'>
            <AuthLayoutHeader />

            <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
                <header className='text-center'>
                    <h1 className='font-bold font-display text-primary text-2xl'>Complete your Chattter profile</h1>
                    <p className='text-muted-foreground text-sm text-balance'>Welcome, complete your profile to enjoy a rich and personalized experience of this platform 🤝</p>
                </header>

                <form onSubmit={handleSubmit(handleUpdateProfile)} className='flex flex-col gap-6 mt-12 md:mt-16 mb-6'>

                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field }) => (
                            <label
                                className={cn('flex flex-col items-center justify-start min-h-20 w-full rounded-lg overflow-hidden',)}
                                htmlFor='avatar'
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="avatar"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            field.onChange(file);
                                            handleImageSelect(e);
                                        }
                                    }}
                                    className='hidden'
                                />
                                {
                                    !watch('avatar') && !selectedImage && !profileImgURL &&
                                    <div className={cn('flex items-center justify-center bg-muted aspect-video w-full cursor-pointer border-2 border-transparent',
                                        errors.avatar && 'border-red-500'
                                    )}>
                                        <UploadIcon className='fill-muted-foreground text-muted-foreground' />
                                    </div>
                                }

                                {
                                    (selectedImage || profileImgURL || watch('avatar')) &&
                                    <div className='relative w-full aspect-video'>
                                        <Image
                                            className=''
                                            src={(() => {
                                                if (userData?.avatar && !selectedImage && !profileImgURL) {
                                                    return userData?.avatar
                                                }
                                                else {
                                                    return profileImgURL || ""
                                                }
                                            })()
                                            }
                                            alt="Preview"
                                            objectFit='cover'
                                            fill
                                        />

                                        <div className='absolute right-0 flex items-center px-4 rounded-lg p-2'>
                                            <Button variant='outline' shape='rounded' className='flex items-center gap-2'
                                                onClick={() => {
                                                    setSelectedImage(null)
                                                    setProfileImgURL(null)
                                                    setValue('avatar', null)
                                                }}
                                            >
                                                <TrashIcon fill='red' />
                                            </Button>

                                        </div>
                                    </div>
                                }
                                {errors.avatar && <FormError errorMessage={errors.avatar?.message as string} className='mb-8' />}

                            </label>
                        )}
                    />




                    <Input
                        type="text"
                        placeholder="Name"
                        label='Name'
                        className='3.875rem'
                        {...register('name')}
                        hasError={!!errors.name}
                        errorMessage={errors.name?.message}
                    />
                    <Input
                        type="text"
                        label='Username'
                        placeholder="Choose username"
                        {...register('username')}
                        className='3.875rem'
                        hasError={!!errors.username}
                        errorMessage={errors.username?.message}
                    />


                    <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself"
                        {...register('bio')}
                        hasError={!!errors.bio}
                        errorMessage={errors.bio?.message}
                        rows={7}
                        showCharacterCount
                        maxLength={300}
                        currentLength={watch('bio')?.length || 0}
                    />

                    <Controller
                        name="interests"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <Label className='text-sm text-muted-foreground'>Interests</Label>
                                <TagInput
                                    presetTags={presetArticleTags}
                                    selectedTags={field.value || []}
                                    onTagsChange={field.onChange}
                                    name='interests'
                                    className='mt-0 mb-1'
                                    hasError={!!errors.interests}
                                    errorMessage={errors.interests?.message}
                                    triggerclassName="!py-6"
                                    selectedClassName="gap-3"
                                />
                            </div>
                        )}
                    />

                    <section>
                        <h5 className='mt-5 mb-1.5'>
                            Socials Links {" "}
                            <span className='text-muted-foreground'>(optional)</span>
                        </h5>
                        <div className='flex flex-col gap-5'>
                            <Input
                                type="text"
                                label='Twitter'
                                placeholder="https://x.com/chattter"
                                {...register('twitter')}
                            />
                            <Input
                                type="text"
                                label="Facebook"
                                placeholder="https://fb.com/chattter"
                                {...register('facebook')}
                            />
                            <Input
                                type="text"
                                label="Linkedin"
                                placeholder="https://linkedin.com/in/chattter"
                                {...register('linkedin')}
                            />
                            <Input
                                type="text"
                                label="Instagram"
                                placeholder="https://instagram.com/chattter"
                                {...register('instagram')}
                            />
                        </div>
                    </section>


                    <Button type="submit" className='w-full space-x-2 bg-[#5574FB]' size="cta">
                        Complete Profile
                        {
                            isLoading && <SmallSpinner />
                        }
                    </Button>
                </form>
            </article>

            <LoadingModal
                isModalOpen={updateUserProfileMutation.isPending}
                errorMsg={'Please have patience while we update your profile'}
            />
        </div>
    );
};

export default NewUserOnboarding;
