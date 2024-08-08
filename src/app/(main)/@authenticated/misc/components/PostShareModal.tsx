import React from 'react'
import { TPost } from '../types'
import { Avatar, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, LinkButton } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { FacebookIcon, FacebookIcon2, LinkedInIcon, TwitterIcon } from '@/components/icons'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
// import {  } from 'lucide-react'

interface Props {
    post: TPost
    isModalOpen: boolean
    closeModal: () => void
}
const PostShareModal: React.FC<Props> = ({ post, isModalOpen, closeModal }) => {




    const copyLink = () => {
        navigator.clipboard.writeText(`https://altschool-semester3-cap-exam.vercel.app/p/${post.post_id}`)
        toast.success('Link copied to clipboard', {
            position: 'top-center',
            duration: 4000
        })
    }


    const shareOnFacebook = `https://www.facebook.com/sharer/sharer.php?u=https://altschool-semester3-cap-exam.vercel.app/p/${post.post_id}`

    const shareOnTwitter = `https://twitter.com/intent/tweet?url=https://altschool-semester3-cap-exam.vercel.app/p/${post.post_id}&text=Check out this post: ${post.title}`

    const shareOnLinkedIn = `https://www.linkedin.com/shareArticle?url=https://altschool-semester3-cap-exam.vercel.app/p/${post.post_id}&title=${post.title}`


    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className='p-6'>
                <DialogHeader>
                    <DialogTitle>Share Post</DialogTitle>
                    <DialogDescription>
                        Share post to social media or copy link to share.
                    </DialogDescription>
                </DialogHeader>

                <article>
                    <div className='relative w-full aspect-video rounded-lg'>
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            layout='fill'
                            objectFit='cover'
                        />
                    </div>
                    <div className='pt-6 px-4'>
                        <h2 className='font-semibold text-xl font-display'>{post.title}</h2>
                        <div className='flex items-center gap-4'>
                            <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
                                <Avatar alt={post.author_username} src={post.author_avatar} fallback={"AUGE BORN"} />
                                <h6>{post.author_name}</h6>
                            </Link>
                            <time className='text-muted-foreground text-sm'>{format(post.created_at.toDate(), 'dd MMM, yyyy')}</time>
                        </div>
                    </div>
                </article>
                <div className='relative flex items-center gap04 border-2 border-primary rounded-full overflow-hidden px-1'>
                    <Input
                        className='p-2 !border-none focus:!border-none focus-within:border-none'
                        containerClassName='grow'
                        type='text'
                        value={`https://altschool-semester3-cap-exam.vercel.app/p/${post.post_id}`}
                        readOnly
                    />
                    <Button onClick={copyLink} className='px-6'>
                        Copy
                    </Button>
                </div>


                <div className='text-sm text-muted-foreground text-center'>
                    &mdash;&mdash;  or share on:  &mdash;&mdash;
                </div>


                <footer className='flex items-center justify-center gap-2'>
                    <LinkButton href={shareOnFacebook} target='_blank' variant="ghost" className='p-2.5 aspect-square rounded-full'>
                        <FacebookIcon2 className='text-foreground' width={24} height={24} />
                    </LinkButton>
                    <LinkButton href={shareOnTwitter} target='_blank' variant="ghost" className='p-2.5 aspect-square rounded-full'>
                        <TwitterIcon className='text-foreground' width={24} height={24} />
                    </LinkButton>
                    <LinkButton href={shareOnLinkedIn} target='_blank' variant="ghost" className='p-2.5 aspect-square rounded-full'>
                        <LinkedInIcon className='text-foreground' width={24} height={24} />
                    </LinkButton>
                </footer>
            </DialogContent>

        </Dialog>
    )
}

export default PostShareModal