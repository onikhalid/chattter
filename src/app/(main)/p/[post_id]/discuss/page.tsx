'use client'

import React from 'react'
import { CommentsDiscussPage } from '@/app/(main)/@authenticated/misc/components'
import { UseGetPostDetails } from '@/app/(main)/new/misc/api'
import { Avatar, Badge, LinkButton, Skeleton } from '@/components/ui'
import { format } from 'date-fns'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'




const PostCommentsDiscussPage = ({ params: { post_id } }: { params: { post_id: string } }) => {
  const { data: post, isLoading } = UseGetPostDetails(post_id)

  return (
    <main className='flex flex-col overflow-y-scroll py-8 w-full'>
      <div className='max-w-[800px] w-full mx-auto'>
        {
          isLoading ? (
            <div className='flex flex-col gap-4 mb-16 w-full'>
              <Skeleton className='h-8 md:h-12 w-[95%] md:w-[82%]' />
              <Skeleton className='h-96' />
            </div>
          )
            :
            (
              <div className='flex flex-col gap-4 mb-16'>
                <h1 className='text-3xl xl:text-4xl font-bold'>{post?.title}</h1>
                <div className='relative w-full aspect-video'>
                  <Image
                    src={post?.cover_image || post_id}
                    alt={post?.title || post_id}
                    className='rounded-lg'
                    fill objectFit="cover"
                  />
                </div>
                <div className='flex items-center justify-between py-5 px-1.5'>
                  <div className='flex items-center gap-4'>
                    <Link href={`/u/${post?.author_username}`} className='flex items-center gap-2'>
                      <Avatar alt={post?.author_username || ""} src={post?.author_avatar} fallback={"AUGE BORN"} size='large' />
                      <h6 className='text-lg'>{post?.author_name}</h6>
                    </Link>
                    <time className='text-muted-foreground text-base'>{format(post?.created_at.toDate()!, 'dd MMM, yyyy')}</time>
                  </div>

                  <LinkButton href={`/p/${post?.post_id}`} variant='secondary' shape='square' size='lg' className='flex items-center  gap-1 group/read hover:gap-2 transition-all duration-300'>
                    Read Post <ArrowRight size={18} className='-rotate-45' />
                  </LinkButton>
                </div>
                {
                  post?.tags && post.tags.length > 0 && (
                    <div className='flex gap-2'>
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant='outline' className='text-sm font-normal'>
                          <Link href={`/tags/${tag}`}>{tag}</Link>
                        </Badge>
                      ))}
                    </div>
                  )
                }
              </div>
            )
        }
        <CommentsDiscussPage post_id={post_id} />
      </div>
    </main>
  )
}

export default PostCommentsDiscussPage