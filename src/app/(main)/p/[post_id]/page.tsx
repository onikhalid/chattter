'use client'

import React, { useContext, useMemo } from 'react'
import { UseGetPostDetails } from '../../new/misc/api'
import { Spinner } from '@/components/icons'
import Image from 'next/image'
import { Avatar } from '@/components/ui'
import Link from 'next/link'
import { format, parse } from 'date-fns'
import { Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Tooltip } from '@/components/ui'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis, Trash, PenBoxIcon, Eye, UserPlus, Share, Heart, Clock, Book } from 'lucide-react'
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'
import { SmallSpinner } from '@/components/icons'
import { UserContext } from '@/contexts'
import { launchNotification } from '@/utils/notifications'
import { useBooleanStateControl } from '@/hooks'
import PostShareModal from '../../@authenticated/misc/components/PostShareModal'
import { UseAddPostToBookmark, UseFollowUser, UseLikePost, UseRemovePostFromBookmark, UseUnFollowUser, UseUnlikePost } from '../../@authenticated/misc/api'
import { averageReadingTime } from '@/utils/quillEditor'


const PostDetailsPage = ({ params }: { params: { post_id: string } }) => {
    const { post_id } = params
    const [user, loading] = useAuthState(auth)
    const { data: post, isLoading } = UseGetPostDetails(post_id)
    const { userFollows, } = useContext(UserContext)
    const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark({ post_id })
    const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark({ post_id })
    const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
    const { mutate: likePost, isPending: isLikingPost } = UseLikePost({ post_id })
    const { mutate: UnlikePost, isPending: isUnLikingPost } = UseUnlikePost({ post_id })

    const {
        state: isShareModalOpen,
        setTrue: openShareModal,
        setFalse: closeShareModal
    } = useBooleanStateControl()

    const saveUnsave = () => {
        if (!loading && !user) {
            toast.error("Login to save posts", {
                position: "top-center",
                duration: 4000
            })
        } else if (user && post && post.bookmarks) {
            if (post.bookmarks?.includes(user?.uid)) {
                deleteBookmark(`${user.uid}_${post.post_id}`)
            } else {
                const bookmarkData = {
                    bookmarker_id: user.uid,
                    post_id: post.post_id,
                    post_cover_image: post.cover_image,
                    post_title: post.title,
                    post_author_name: post.author_name,
                    post_author_id: post.author_id,
                    post_author_username: post.author_username,
                    post_author_avatar: post.author_avatar
                }
                addBookmark(bookmarkData)
            }
        }
    }
    const followUnfollow = () => {
        if (!loading && !user) {
            launchNotification("error", "Login to follow users")
        } else if (user && post) {
            const data = {
                follower_id: user.uid || '',
                followed_id: post.author_id
            }
            if (userFollows?.includes(user?.uid)) {
                unfollowUser(data)
            } else {
                followUser(data)
            }
        }
    }
    const likeUnlike = () => {

        if (!loading && !user) {
            launchNotification("error", "Login to like posts")
        } else if (user && post) {
            const data = {
                liker_id: user.uid || '',
                post_id
            }
            if (post.likes?.includes(user?.uid)) {
                UnlikePost(data)
            } else {
                likePost(data)
            }
        }
    }
    const timetoRead = useMemo(() => Math.ceil(averageReadingTime(post?.content || '0') / 60), [post?.content])


    return (
        <main className="relative grow flex flex-col w-full px-4 lg:px-[7.5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">

            {
                isLoading ?
                    <div className='flex items-center justify-center size-full'>
                        <Spinner className='text-foreground' />
                    </div>
                    :
                    !isLoading && post ?
                        <div className='flex flex-col w-full max-w-[1280px] py-8 mx-auto'>
                            <header className='relative flex flex-col'>
                                <div className='relative w-full aspect-video'>
                                    <Image src={post.cover_image || ''}
                                        alt={post.title || ''}
                                        className='w-full h-full object-cover rounded-10'
                                        fill
                                        objectFit='cover'
                                    />
                                </div>

                                <div className='flex flex-col gap-4 items-center justify-center p-4 py-6 lg:py-10 h-full text-center'>
                                    <h1 className='text-3xl xl:text-5xl font-semibold font-display'>{post.title}</h1>
                                    <div className='flex items-center gap-5'>
                                        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
                                            <Avatar alt={post.author_username} src={post.author_avatar} fallback={post.author_name || "AUGE BORN"} size='large'/>
                                            <h6 className='text-[1.125rem]'>{post.author_name}</h6>
                                        </Link>

                                        <time className='flex items-center gap-1 text-muted-foreground text-sm'>
                                            <Clock size={14}/>
                                            {post.created_at ? format(post.created_at?.toDate(), 'dd MMM, yyyy') : 'Invalid date'}
                                        </time>

                                        <p className='flex items-center gap-1 text-muted-foreground text-sm'>
                                            <Book size={14}/>
                                            {timetoRead} min read
                                        </p>
                                    </div>


                                    {
                                        user &&
                                        <div className='flex items-center gap-4'>
                                            <Tooltip content={post.bookmarks?.includes(user?.uid) ? "Remove post from archive" : "Save post"} className='flex items-center gap-1'>
                                                {
                                                    isSavingBookmark || isRemovingBookmark ?
                                                        <SmallSpinner className='text-primary' />
                                                        :
                                                        post.bookmarks?.includes(user?.uid) ?
                                                            <BookmarkX onClick={saveUnsave} className='text-foreground stroke-[2.5px] cursor-pointer fill-foreground' />
                                                            :
                                                            <BookmarkPlus onClick={saveUnsave} className='text-foreground hover:text-primary cursor-pointer' />
                                                }
                                                <span className='font-medium text-lg'>
                                                    {post.bookmarks?.length || 0}
                                                </span>
                                            </Tooltip>

                                            <Tooltip content={user && post.likes?.includes(user?.uid) ? "Unlike post" : "Like post"} className='flex items-center gap-1'>
                                                {
                                                    isLikingPost || isUnLikingPost ?
                                                        <SmallSpinner className='text-primary' />
                                                        :
                                                        post && post.likes?.includes(user?.uid) ?
                                                            <Heart onClick={likeUnlike} className='text-foreground stroke-[2.5px] cursor-pointer fill-foreground' />
                                                            :
                                                            <Heart onClick={likeUnlike} className='text-foreground cursor-pointer' />
                                                }
                                                <span className='font-medium text-lg'>
                                                    {post.likes?.length || 0}
                                                </span>
                                            </Tooltip>
                                        </div>
                                    }
                                    <Link href={`/p/${post_id}/discuss`}>D</Link>
                                </div>
                            </header>



                            <div className='grid md:grid w-full max-w-[750px] mx-auto'>
                                <div className='articleContent' dangerouslySetInnerHTML={{ __html: post.content }} />
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