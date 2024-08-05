'use client'

import React, { useCallback, useContext, useRef, useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { z } from 'zod';

import { Avatar, Button, ChatterLogo, Input, LinkButton, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { auth, storage } from '@/utils/firebaseConfig';
import { zodResolver } from '@hookform/resolvers/zod';
import { getInitials } from '@/utils/strings';
import { PenIcon, ViewIcon } from '@/components/icons';
import { ThemeContext } from '@/contexts';
import Image from 'next/image';



const Schema = z.object({
    title: z.string({ message: 'Title is required' }),
    content: z.string({ message: 'You cannot post an empty article' }),
});

type createNewPostFormDataType = z.infer<typeof Schema>

const WriteNewStoryPage = () => {
    const [user] = useAuthState(auth);
    const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
    const { theme } = useContext(ThemeContext);
    const quillRef = useRef<any>(null);
    const postToEditId = useSearchParams().get('edit');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [coverImgURL, setCoverImgURL] = useState<string | null>(null)
    const [previousCoverImgURL, setPreviousCoverImgURL] = useState<string | null>(null)
    const {
        register, control, handleSubmit, setValue, watch, setError, clearErrors, formState: { isValid, errors },
    } = useForm<createNewPostFormDataType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            content: "",
        },
        mode: "onChange",
    });

    const handleCreateNewPost = (data: createNewPostFormDataType) => {
        const { content } = watch();
        console.log(content);
    }


    const customImageHandler = useCallback(async () => {
        const handleImageUpload = async (file: File): Promise<string> => {
            if (!user?.uid) {
                throw new Error("User not authenticated");
            }

            const storageRef = ref(storage, `post_images/${user.uid}/${file.name}`);

            try {
                const snapshot = await uploadBytes(storageRef, file, {
                    contentType: file.type,
                    customMetadata: {
                        // Add any additional metadata you need for the image
                    },
                });

                const downloadURL = await getDownloadURL(snapshot.ref);
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
                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', downloadURL);
                }
            }
        };
        document.body.appendChild(input);
        document.body.removeChild(input);

    }, [setValue, user?.uid, watch]);


    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                [{ 'align': [] }],
                ['clean']
            ],
            handlers: {
                image: customImageHandler
            }
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const uploadImage = async (imageFile: File) => {
    };

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (postToEditId) {
            setPreviousCoverImgURL(coverImgURL)
        }

        setSelectedImage(file);
        const newImgURL = URL.createObjectURL(file)
        setCoverImgURL(newImgURL)

    };


    
    return (
        <main className="flex flex-col h-screen items-center justify-between font-display overflow-hidden">
            <header className="sticky top-0 flex items-center justify-between w-full px-5 py-3 md:px-10 md:py-4 border-b-[0.3px] border-b-[#E4E7EC]">
                <ChatterLogo />
                <section className='flex items-center gap-2'>
                    <LinkButton href='new-story' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
                        Write story <PenIcon />
                    </LinkButton>

                    <Popover>
                        <PopoverTrigger>
                            <Avatar alt='' fallback={getInitials(user?.displayName! || "")} src={user?.photoURL} />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div>
                                <span className="text-sm">Signed in as</span>
                                <h6 className="font-semibold">{user?.displayName}</h6>
                            </div>
                        </PopoverContent>
                    </Popover>
                </section>
            </header>

            <div className="grow w-full px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] pt-8 overflow-scroll max-w-[1200px]">

                <form action="" onSubmit={handleSubmit(handleCreateNewPost)}>

                    <Input
                        className='!border-none font-display text-4xl xl:text-5xl mb-4 font-bold focus:border-none placeholder:!text-[#B6B5B5] focus-visible:border-none text-center'
                        {...register('title')}
                        placeholder='Title'
                    />

                    <article className='ImageUploader'>
                        <input type="file" onChange={handleImageSelect} />
                        {
                            !selectedImage && !coverImgURL &&
                            <div className='rulesdiv'>
                                <h6>1. Try as much as possible to ensure your image is in landscape form</h6>
                                <h6>2. If you&apos;re uploading an image you&apos;ve previously uploaded in another post, make sure to change its name before uploading.</h6>
                            </div>
                        }
                        {
                            (selectedImage || coverImgURL) &&
                            <div className='relative w-full aspect-video'>
                                <Image
                                    className=''
                                    src={coverImgURL || ""}
                                    alt="Preview"
                                    objectFit='cover'
                                    fill
                                />
                            </div>
                        }
                    </article>
                    <Controller
                        name="content"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <div>
                                <ReactQuill
                                    // ref={quillRef}
                                    theme="snow"
                                    value={field.value.replace("<p><br></p>", "") || ''}
                                    onBlur={field.onBlur}
                                    onChange={(content, delta, source, editor) => {
                                        const updatedContent = content.replace(/<p><br><\/p>/g, '');
                                        field.onChange(updatedContent);
                                    }}
                                    modules={modules}
                                    className={`w-full p-4 mt-2 rounded-lg bg-background text-black outline-none ${errors?.content && errors?.content?.message ? "showcase-input-error" : ""}`}
                                    placeholder='Write your story...'
                                    id="myQuillEditor"
                                    style={{
                                        color: theme === 'dark' ? '#fff' : '#000',
                                        border: "none",
                                    }}

                                />
                            </div>
                        )}
                    />
                </form>
            </div>
        </main>
    )
}

export default WriteNewStoryPage
