'use client'

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z, ZodError } from 'zod';
import { getDoc, doc, setDoc, query, collection, where, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

import { Button, ChatterLogo, FormError, Input, TagInput, Textarea } from '@/components/ui';
import { FacebookIcon, GoogleIcon, SmallSpinner, TrashIcon, UploadIcon } from '@/components/icons';
import { auth, db, storage } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchNotification } from '@/utils/notifications';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AuthLayoutHeader } from '../misc/components';
import { presetArticleTags } from '@/constants';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { TUser } from '@/contexts';
import { cn } from '@/lib/utils';



const OnboardingForm = z.object({
    name: z.string({ required_error: 'Enter your name' }).min(3, { message: 'Name must be at least 3 characters' }),
    username: z.string({ required_error: 'Enter username' }).min(3, { message: 'Username must be at least 3 characters' }),
    interests: z.array(z.string()).min(3, { message: 'Please select at least three interest' }),
    bio: z.string({ required_error: 'Enter bio' }).min(20, { message: 'Bio must be at least 20 characters' }),
    twitter: z.string().url().optional(),
    facebook: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    instagram: z.string().url().optional(),
    avatar: z.any().nullable().refine(
        file => {
            if (!file) {
                throw ZodError.create([{
                    path: ['avatar'],
                    message: 'Please select a profile image.',
                    code: 'custom',
                }]);
            }
            if (!file.type.startsWith('image/')) {
                throw ZodError.create([{
                    path: ['avatar'],
                    message: 'Please select a valid image file.',
                    code: 'custom',
                }]);
            }
            return file.size <= 10000000;
        },

        {
            message: 'Max image size is 10MB.',
        }
    ),
});
type OnboardingFormType = z.infer<typeof OnboardingForm>


const Login: React.FC = () => {
    const [user, loading] = useAuthState(auth);
    const { handleSubmit, register, formState: { errors, isDirty, isValid }, control, watch, setError, setValue } = useForm<OnboardingFormType>({
        defaultValues: {
            name: user?.displayName || '',
            username: '',
            interests: [],
            bio: ''
        },
        resolver: zodResolver(OnboardingForm)
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [profileImgURL, setProfileImgURL] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const newUserPic = "/assets/img/unknown_user_profile_picture.png"
    const [userData, setUserData] = useState<TUser | undefined | null>(null);

    useEffect(() => {
        if (!loading && user) {
            const userDocRef = doc(db, `users/${user?.uid}`);
            const getUserData = async () => {
                const userDocSnap = await getDoc(userDocRef);
                const userData = userDocSnap.data() as TUser;
                setUserData(userData)

                if (userData) {
                    setValue('username', userData.username || '')
                    setValue('bio', userData.bio || '')
                    setValue('interests', userData.interests || [])
                    setValue('twitter', userData.twitter || '')
                    setValue('facebook', userData.facebook || '')
                    setValue('linkedin', userData.linkedin || '')
                    setValue('instagram', userData.instagram || '')
                    setProfileImgURL(userData.avatar || null)
                    // setValue(userData.profilePicture || newUserPic)
                }
            }
            getUserData()
        }
    }, [user, loading])



    const handleUploadImage = async (imageFile: File) => {
        const picRef = ref(storage, `avatars/${user?.uid}.jpg`);
        // const fileExists = await checkFileExists(picRef);

        // if (fileExists) {
        //   await deleteObject(picRef)
        // }

        const snapshot = await uploadBytes(picRef, imageFile)
        const downloadURL = await getDownloadURL(snapshot.ref)

        return downloadURL;
    };

    const handleUpdateProfile = async (data: OnboardingFormType) => {
        document.body.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" })

        try {
            const newImageURL = selectedImage && await handleUploadImage(selectedImage)
            const userData = {
                id: user?.uid,
                name: data.name,
                username: data.username,
                bio: data.bio,
                avatar: selectedImage ? newImageURL : profileImgURL,

                twitter: data.twitter,
                instagram: data.instagram,
                facebook: data.facebook,
            }

            const userDocRef = doc(db, `users/${user?.uid}`);
            await updateDoc(userDocRef, { ...userData });
            if (user) {
                await updateProfile(user, { photoURL: selectedImage ? newImageURL : profileImgURL, displayName: data.name })
            }
            const batch = writeBatch(db);





            //////////////////////////////////////////////////////////////////////////////////
            /////   UPDATE NAME AND AVATAR IN POSTS USER HAS PREVIOUSLY CREATED/FEATURED IN
            /////  POSTS
            const allUsersPostsQuery = query(collection(db, 'posts'), where('authorId', '==', user?.uid));
            const allUsersPostsSnap = await getDocs(allUsersPostsQuery)

            allUsersPostsSnap.docs.forEach(async (posts) => {
                const post = posts.data();
                const postDocRef = doc(db, `posts/${post.post_id}`)

                batch.update(postDocRef, {
                    author_name: data.name,
                    author_avatar: selectedImage ? newImageURL : profileImgURL,
                    author_username: data.username
                })
            })


            /////  BOOKMARKS
            const allUsersPostsBookmarkssQuery = query(collection(db, 'bookmarks'), where('authorId', '==', user?.uid));
            const allUsersPostsBookmarksSnap = await getDocs(allUsersPostsBookmarkssQuery)
            allUsersPostsBookmarksSnap.docs.forEach(async (allBookmarks) => {
                const bookmark = allBookmarks.data();
                const bookmsrkDocRef = doc(db, `bookmarks/${bookmark.bookmarkId}`)

                batch.update(bookmsrkDocRef, {
                    post_author_name: data.name,
                    post_author_avatar: selectedImage ? newImageURL : profileImgURL
                })
            });




            /////  FOLDERS
            const allUsersFoldersQuery = query(collection(db, 'folders'), where('userId', '==', user?.uid));
            const allUsersFoldersSnap = await getDocs(allUsersFoldersQuery)
            allUsersFoldersSnap.docs.forEach(async (allFolders) => {
                const folder = allFolders.data();
                const folderDocRef = doc(db, `folders/${folder.folderId}`)

                batch.update(folderDocRef, {
                    folder_owner_name: data.name,
                    folder_owner_avatar: selectedImage ? newImageURL : profileImgURL
                })
            });



            /////  CONTRIBUTIONS
            const allUsersContributionsQuery = query(collection(db, 'contributions'), where('authorId', '==', user?.uid));
            const allUsersContributionSnap = await getDocs(allUsersContributionsQuery)

            allUsersContributionSnap.docs.forEach(async (allContributions) => {
                const contribution = allContributions.data();
                const contributionDocRef = doc(db, `contributions/${contribution.contributeId}`)

                batch.update(contributionDocRef, {
                    author_name: data.name,
                    author_avatar: selectedImage ? newImageURL : profileImgURL,
                    author_username: data.username
                })
            });

            await batch.commit();


            toast.success("Profile updated successfully", {
                position: 'top-center',
                duration: 2000,
            })

            router.push(`/`)
        } catch (error) {
            console.log(error)
        }
    }




    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        setSelectedImage(file);
        const newImgURL = URL.createObjectURL(file)
        setProfileImgURL(newImgURL)
    };




    return (
        <div className='bg-primary-foreground min-h-screen font-display w-full overflow-y-scroll'>
            <AuthLayoutHeader />

            <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
                <header className='text-center'>
                    <h1 className='font-bold font-display text-primary text-2xl'>Complete your Chatter profile</h1>
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
                                    !watch('avatar') && !userData?.avatar &&
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
                                            src={                                                (() => {
                                                    if (userData?.avatar && !selectedImage && !profileImgURL) {
                                                        return userData?.avatar
                                                    }
                                                    else {
                                                        return profileImgURL || watch('avatar') || ""
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
                                                    setValue('avatar', undefined)
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
                        className='3.875rem'
                        {...register('name')}
                        hasError={!!errors.name}
                        errorMessage={errors.name?.message}
                    />
                    <Input
                        type="text"
                        placeholder="Choose username"
                        {...register('username')}
                        className='3.875rem'
                        hasError={!!errors.username}
                        errorMessage={errors.username?.message}
                    />


                    <Textarea
                        placeholder="Tell us about yourself"
                        {...register('bio')}
                        hasError={!!errors.bio}
                        errorMessage={errors.bio?.message}
                        rows={7}
                    />

                    <Controller
                        name="interests"
                        control={control}
                        render={({ field }) => (
                            <TagInput
                                presetTags={presetArticleTags}
                                selectedTags={field.value || []}
                                onTagsChange={field.onChange}
                                className='mt-2 mb-1'
                                triggerclassName="!py-6"
                            />
                        )}
                    />


                    <div className='flex flex-col gap-4'>
                        <Input
                            type="text"
                            placeholder="Twitter"
                            {...register('twitter')}
                        />
                        <Input
                            type="text"
                            placeholder="Facebook"
                            {...register('facebook')}
                        />
                        <Input
                            type="text"
                            placeholder="Linkedin"
                            {...register('linkedin')}
                        />
                        <Input
                            type="text"
                            placeholder="Instagram"
                            {...register('instagram')}
                        />
                    </div>


                    <Button type="submit" className='w-full space-x-2 bg-[#5574FB]' size="cta">
                        Complete Profile
                        {
                            isLoading && <SmallSpinner />
                        }
                    </Button>
                </form>
            </article>
        </div>
    );
};

export default Login;
