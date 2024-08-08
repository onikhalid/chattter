'use client'

import React from 'react'
import { UseGetPostDetails } from '../../new/misc/api'
import { Spinner } from '@/components/icons'
import Image from 'next/image'
import { Avatar } from '@/components/ui'
import Link from 'next/link'
import { format, parse } from 'date-fns'

const PostDetailsPage = ({ params }: { params: { post_id: string } }) => {
    const { post_id } = params
    const { data, isLoading } = UseGetPostDetails(post_id)

   
    return (
        <main className="relative grow flex flex-col w-full px-4 lg:px-[7.5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">

            {
                isLoading ?
                    <div className='flex items-center justify-center size-full'>
                        <Spinner className='text-foreground' />
                    </div>
                    :
                    !isLoading && data ?
                        <div className='flex flex-col w-full max-w-[1280px] py-8 mx-auto'>
                            <header className='relative flex flex-col'>
                                <div className='relative w-full aspect-video'>
                                    <Image src={data.cover_image || ''}
                                        alt={data.title || ''}
                                        className='w-full h-full object-cover rounded-10'
                                        fill
                                        objectFit='cover'
                                    />
                                </div>
                                <div className='flex flex-col items-center justify-center p-4 mb-6 h-full'>
                                    <h1 className='text-3xl xl:text-4xl font-semibold font-display'>{data.title}</h1>
                                    <div className='flex items-center gap-4'>
                                        <Link href={`/u/${data.author_username}`} className='flex items-center gap-2'>
                                            <Avatar alt={data.author_username} src={data.author_avatar} fallback={"AUGE BORN"} />
                                            <h6>{data.author_name}</h6>
                                        </Link>

                                        <time className='text-muted-foreground text-sm'>
                                            {data.created_at ? format(data.created_at.toDate(), 'dd MMM, yyyy') : 'Invalid date'}
                                        </time>
                                    </div>
                                </div>
                            </header>

                            <div className='grid md:grid w-full max-w-[750px] mx-auto'>

                                <div dangerouslySetInnerHTML={{ __html: data.content }} />
                            </div>
                        </div>
                        :
                        <div>
                            Post not found
                        </div>
            }
        </main>
    )
}

export default PostDetailsPage