'use client'

import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Controller, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import { z, ZodError } from "zod";

import { Button, FormError, Input, LoadingModal, TagInput, Textarea } from '@/components/ui'
import { auth, storage } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrashIcon, UploadIcon, } from '@/components/icons';
import { UserContext } from '@/contexts';
import { cn } from '@/lib/utils';
import { presetArticleTags } from '@/constants';

import { UseCreateNewPost, UseGetPostDetails, UseUpdateNewPost } from './misc/api';
import { deleteImageFromDatabase, extractImageUrls, generateTitleSearchTerms, uploadCoverImage } from './misc/utils';







const WriteNewStoryPage = () => {
    const params = useSearchParams()
    const router = useRouter()
    const postToEditId = params.get('edit');
    const CreateNewPostFormSchema = z.object({
        title: z.string({ message: 'Title is required' }).min(5, { message: 'Title must be at least 5 characters' }),
        content: z.string({ message: 'You cannot post an empty article' }).min(50, { message: 'Article must be at least 50 characters' }),
        tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
        cover_image: z.any().nullable().refine(
            file => {
                if ((!postToEditId && !file)) {
                    throw ZodError.create([{
                        path: ['cover_image'],
                        message: 'Please select a cover image.',
                        code: 'custom',
                    }]);
                }
                if ((!postToEditId && !file.type.startsWith('image/'))) {
                    throw ZodError.create([{
                        path: ['cover_image'],
                        message: 'Please select a valid image file.',
                        code: 'custom',
                    }]);
                }
                if (!postToEditId && file) {
                    return file.size <= 10000000;
                }
                else return true
            },

            {
                message: 'Max image size is 10MB.',
            }
        ),
    });
    type createNewPostFormDataType = z.infer<typeof CreateNewPostFormSchema>

    const [user, loading] = useAuthState(auth);
    const { userData } = useContext(UserContext);

    const { data: postData, isLoading: isFetchingPostData } = UseGetPostDetails(postToEditId)
    const { mutate: createPost, isPending: isCreatingPost } = UseCreateNewPost()
    const { mutate: updatePost, isPending: isUpdatingPost } = UseUpdateNewPost()

    const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


    const {
        register, control, handleSubmit, setValue, watch, setError, clearErrors, formState: { isValid, errors }, reset
    } = useForm<createNewPostFormDataType>({
        resolver: zodResolver(CreateNewPostFormSchema),
    });


    useEffect(() => {
        if (postData) {
            setValue('title', postData.title)
            setValue('tags', postData.tags)
            setValue('content', postData.content)
            setCoverImgURL(postData.cover_image)

        }
    }, [isFetchingPostData, postData, setValue])

    const [selectedCoverImageFile, setSelectedCoverImageFile] = useState<File | null>(watch('cover_image') ?? null);
    const [coverImgURL, setCoverImgURL] = useState<string | null>(postData?.cover_image || null)
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);





    const handleCreateNewPost = async (data: createNewPostFormDataType) => {
        const submittedData = data;
        const currentContent = watch('content');
        const currentImages = extractImageUrls(currentContent);

        const deletedImages = uploadedImages.filter(
            (url) => !currentImages.includes(url)
        );

        for (const url of deletedImages) {
            await deleteImageFromDatabase(url);
        }
        const dataToSubmit = {
            ...data,
            author_id: user?.uid || "",
            author_avatar: userData?.avatar || "",
            author_username: userData?.username || "",
            author_name: userData?.name || "",
            created_at: postData?.created_at || new Date(),
            tags_lower: data.tags.map(tag => tag.toLowerCase() || ""),
            title_for_search: [...generateTitleSearchTerms(data.title), ...(userData?.name || "").toLowerCase().split(" "), userData?.username || ""],
            cover_image: postData?.cover_image || "",
            total_reads: postData?.total_reads || 0,
            likes: postData?.likes || [],
            bookmarks: postData?.bookmarks || [],
        };

        if (postToEditId) {
            updatePost({ ...dataToSubmit, post_id: postToEditId }, {
                onSuccess: async (data) => {

                    deletedImages.filter((imageUrl) => submittedData?.content.includes(imageUrl));
                    for (const imageUrl of deletedImages) {
                        deleteImageFromDatabase(imageUrl);
                    }
                    if (selectedCoverImageFile) {
                        await uploadCoverImage({ imageFile: selectedCoverImageFile!, postId: postToEditId });
                    }
                    reset();
                    setCoverImgURL(null)
                    setSelectedCoverImageFile(null)
                    router.push(`/p/${postToEditId}`)
                },
                onError: (error) => {
                    console.error('Error updating post:', error);
                }
            });
        }

        else {
            createPost(dataToSubmit, {
                onSuccess: async (data) => {
                    console.log(data, 'Post created successfully');
                    const newDocId = data?.id as string || "";

                    deletedImages.filter((imageUrl) => submittedData?.content.includes(imageUrl));
                    for (const imageUrl of deletedImages) {
                        deleteImageFromDatabase(imageUrl);
                    }
                    await uploadCoverImage({ imageFile: selectedCoverImageFile!, postId: newDocId });
                    reset();
                    setSelectedCoverImageFile(null)
                    setCoverImgURL(null)
                    router.push(`/?v=all`)
                },
                onError: (error) => {
                    console.error('Error creating post:', error);
                }
            });
        }

    };



    const QuillimageSelectionHandler = useCallback(async () => {
        const handleImageUpload = async (file: File): Promise<string> => {
            if (!loading && !user?.uid) {
                throw new Error("User not authenticated");
            }
            const storageRef = ref(storage, `post_images/${user?.uid}/${file.name}_${new Date().toString()}`);

            try {
                const snapshot = await uploadBytes(storageRef, file, {
                    contentType: file.type,
                    customMetadata: {},
                });

                const downloadURL = await getDownloadURL(snapshot.ref);
                setUploadedImages((prev) => [...prev, downloadURL]);
                return downloadURL;
            } catch (error) {
                console.error(error);
                throw new Error("Image upload failed.");
            }
        };

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const downloadURL = await handleImageUpload(file);
                const prevContent = watch('content')
                setValue('content', prevContent + `<img src="${downloadURL}" alt="image" />`)
            }
        };
        document.body.appendChild(input);
        document.body.removeChild(input);

    }, [setValue, user?.uid, watch, loading]);



    const handleCoverImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        setSelectedCoverImageFile(file);
        const newImgURL = URL.createObjectURL(file)
        setCoverImgURL(newImgURL)
    };



    if (isFetchingPostData) {
        return (<LoadingModal
            isModalOpen={isFetchingPostData}
            errorMsg='Please wait while we fetch the post data'
        />)
    }








    return (
        <main className="relative grow flex items-start justify-center w-full px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] pt-8 overflow-scroll">
            <form action="" onSubmit={handleSubmit(handleCreateNewPost)} className=' w-full max-w-[1000px]' id='form'>

                <Textarea
                    className='!border-none font-display text-4xl xl:text-5xl mb-4 font-bold focus:border-none focus-visible:border-none text-center'
                    {...register('title')}
                    placeholder='Enter Title'
                    hasError={!!errors.title}
                    errorMessage={errors.title?.message}
                    errorMessageClass='mb-8 text-center rounded-lg'
                />



                <Controller
                    name="cover_image"
                    control={control}
                    render={({ field }) => (
                        <label
                            className={cn('flex flex-col items-center justify-start min-h-20 w-full rounded-lg overflow-hidden',)}
                            htmlFor='cover_image'
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="cover_image"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                        handleCoverImageSelect(e);
                                    }
                                }}
                                className='hidden'
                            />
                            {
                                !watch('cover_image') && !postData?.cover_image &&
                                <div className={cn('flex items-center justify-center bg-muted aspect-video w-full cursor-pointer border-2 border-transparent',
                                    errors.cover_image && 'border-red-500'
                                )}>
                                    <UploadIcon />
                                </div>
                            }

                            {
                                (selectedCoverImageFile || coverImgURL || watch('cover_image')) &&
                                <div className='relative w-full aspect-video'>
                                    <Image
                                        className=''
                                        src={
                                            (() => {
                                                if (postData?.cover_image && !selectedCoverImageFile && !coverImgURL) {
                                                    return postData?.cover_image
                                                }
                                                else {
                                                    return coverImgURL || watch('cover_image') || ""
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
                                                setSelectedCoverImageFile(null)
                                                setCoverImgURL(null)
                                                setValue('cover_image', undefined)
                                            }}
                                        >
                                            <TrashIcon fill='red' />
                                        </Button>

                                    </div>
                                </div>
                            }
                            {errors.cover_image && <FormError errorMessage={errors.cover_image?.message as string} className='mb-8' />}

                        </label>
                    )}
                />


                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <TagInput
                            presetTags={presetArticleTags}
                            selectedTags={field.value || []}
                            onTagsChange={field.onChange}
                            className='mt-10 mb-1'
                            triggerclassName="!py-6"
                            hasError={!!errors.tags}
                            errorMessage={errors.tags?.message}
                        />
                    )}
                />


                <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <div className={''}>
                            <ReactQuill
                                theme="snow"
                                value={field?.value?.replace("<p><br></p>", "") || ''}
                                onBlur={field.onBlur}
                                onChange={(content, delta, source, editor) => {
                                    const updatedContent = content.replace(/<p><br><\/p>/g, '');
                                    field.onChange(updatedContent);

                                }}

                                modules={{
                                    toolbar: {
                                        container: [
                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                            [{ 'align': [] }],

                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                        handlers: {
                                            image: QuillimageSelectionHandler
                                        }
                                    },
                                    clipboard: {
                                        matchVisual: false,
                                    },
                                }}

                                className={`w-full py-4 px-0 mt-2 rounded-lg bg-background text-black outline-none ${errors?.content && errors?.content?.message ? "showcase-input-error" : ""}`}
                                placeholder='Start writing...'
                                style={{ border: "none" }}
                                id="myQuillEditor"


                            />
                        </div>
                    )}
                />
                {/* <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <div className={cn('flex flex-col border-2 border-transparent rounded-lg mt-6', errors.content && 'border-red-500 my-8 ')}>
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onBlur={field.onBlur}
                                onChange={(content, delta, source, editor) => {
                                    const previousContent = watch('content');
                                    field.onChange(content);

                                    const deletedImage = findDeletedImage(previousContent, content);

                                    if (deletedImage) {
                                        const deletedImageUrls = extractImageUrls(deletedImage);
                                        setDeletedImages([...deletedImages, ...deletedImageUrls!]);
                                    }
                                }}
                                modules={QuillModules}
                                className={`w-full py-4 px-0 mt-2 rounded-lg bg-background text-black outline-none ${errors?.content && errors?.content?.message ? "showcase-input-error" : ""}`}
                                placeholder='Start writing...'
                                id="myQuillEditor"
                                style={{border: "none"}}

                            />
                            {errors.content && <FormError errorMessage={errors.content?.message as string} className='mb-8 text-center mx-6' />}
                        </div>
                    )}
                /> */}
            </form>


            <LoadingModal
                isModalOpen={isCreatingPost || isUpdatingPost}
                errorMsg={'Please wait for the post to finish uploading'}
            />
        </main>
    )
}

export default WriteNewStoryPage
