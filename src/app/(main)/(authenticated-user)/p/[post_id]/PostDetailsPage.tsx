'use client'

import React, { useContext, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BookmarkX, BookmarkPlus, Heart, Clock, Book, Share2, MessageSquareText, Eye, Ellipsis, PenBoxIcon, Trash, TrendingUp } from 'lucide-react'
import { useInView } from 'react-intersection-observer';
import { v4 as uuidv4 } from 'uuid';

import { Spinner } from '@/components/icons'
import { Avatar, Badge, Button, ConfirmDeleteModal, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { Tooltip } from '@/components/ui'
import { auth, db } from '@/utils/firebaseConfig'
import { SmallSpinner } from '@/components/icons'
import { UserContext } from '@/contexts'
import { useBooleanStateControl } from '@/hooks'
import { averageReadingTime } from '@/utils/quillEditor'
import { cn } from '@/lib/utils'

import PostShareModal from '../../misc/components/PostShareModal'
import { TPost } from '../../misc/types'
import { UseAddPostToBookmark, useDeletePost, UseFollowUser, UseLikePost, UseRemovePostFromBookmark, UseUnFollowUser, UseUnlikePost } from '../../misc/api'
import { arrayUnion, collection, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'


interface Props {
    post: TPost | undefined
    isLoading: boolean
    post_id: string
}
const PostDetailsPage:React.FC<Props> = ({post_id, post, isLoading}) => {
    const { ref, inView } = useInView();
    const [user, loading] = useAuthState(auth)
    const { userFollows, } = useContext(UserContext)
    const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark({ post_id })
    const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark({ post_id })
    const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
    const { mutate: likePost, isPending: isLikingPost } = UseLikePost({ post_id })
    const { mutate: UnlikePost, isPending: isUnLikingPost } = UseUnlikePost({ post_id })
    const { mutate: deletePost, isPending: isDeletingComment } = useDeletePost()
    const timetoRead = useMemo(() => Math.ceil(averageReadingTime(post?.content || '0') / 60), [post?.content])


    useEffect(() => {
        async function trackView(post_id: string) {
            let reader_id: string;

            if (!loading && user) {
                reader_id = `${user?.uid}`;
            } else {
                reader_id = sessionStorage.getItem('readerSessionId') || uuidv4();
                sessionStorage.setItem('readerSessionId', reader_id);
            }

            const postRef = doc(db, 'posts', post_id);
            const readRef = doc(db, 'postReads', `${user?.uid}_${post_id}`);

            try {
                const readDoc = await getDoc(readRef);

                if (!readDoc.exists()) {
                    await setDoc(readRef, {
                        post_id,
                        reader_id,
                        created_at: serverTimestamp()
                    });

                    await updateDoc(postRef, {
                        unique_reads: increment(1),
                        total_reads: increment(1)
                    });
                } else {
                    await updateDoc(postRef, {
                        total_reads: increment(1)
                    });
                }
            } catch (error) {
                console.error('Error tracking view:', error);
            }
        }

        if (!isLoading && post) {
            trackView(post_id);
        }
    }, [post_id, isLoading])


    const {
        state: isShareModalOpen,
        setTrue: openShareModal,
        setFalse: closeShareModal
    } = useBooleanStateControl()
    const {
        state: isConfirmDeleteModalOpen,
        setTrue: openConfirmDeleteModal,
        setFalse: closeConfirmDeleteModal
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
                    post_author_avatar: post.author_avatar,
                    created_at: new Date(),

                }
                addBookmark(bookmarkData)
                toast.success("Post saved")
            }
        }
    }

    const followUnfollow = () => {
        if (!loading && !user) {
            toast.error("Login to follow users")
        } else if (user && post) {
            const data = {
                follower_id: user.uid || '',
                followed_id: post.author_id
            }
            if (userFollows?.includes(post.author_id)) {
                unfollowUser(data)
                toast.success(`Unfollowed ${post.author_name}`)
            } else {
                followUser(data)
                toast.success(`Followed ${post.author_name}`)
            }
        }
    }

    const likeUnlike = () => {
        if (!loading && !user) {
            toast.error("Login to like posts")
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


    const handleDelete = () => {
        const data = { post_id: post?.post_id! }
        deletePost(data)
        closeConfirmDeleteModal()
        toast.success("Post deleted successfully")
    }


    return (
        <main className="relative grow flex flex-col w-full px-4 lg:px-[7.5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
        
            {
                isLoading ?
                    <div className='flex items-center justify-center size-full'>
                        <Spinner className='text-foreground' />
                    </div>
                    :
                    !isLoading && post ?
                        <div className='relative flex flex-col w-full max-w-[1280px] py-8 mx-auto'>
                            <header className='relative flex flex-col' ref={ref}>
                                <div className='relative w-full aspect-video'>
                                    <Image src={post.cover_image || ''}
                                        alt={post.title || ''}
                                        className='w-full h-full object-cover rounded-10'
                                        fill
                                        objectFit='cover'
                                    />
                                </div>

                                <div className='flex flex-col gap-4 items-center justify-center p-4 py-6 lg:py-10 h-full text-center'>
                                    <h1 className='text-3xl xl:text-5xl font-semibold font-display !text-balance'>{post.title}</h1>

                                    {
                                        post.tags && post.tags.length > 0 &&
                                        <div className='flex items-center justify-center gap-2 mt-4 flex-wrap'>
                                            {
                                                post.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" size="lg" className='text-sm min-w-max'>
                                                        <Link href={`/tags/${tag.toLowerCase()}`}>
                                                            {tag}
                                                        </Link>
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    }

                                    <div className='flex max-md:flex-col items-center gap-x-5 gap-y-2.5 mt-4'>
                                        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
                                            <Avatar alt={post.author_username} src={post.author_avatar} fallback={post.author_name || "AUGE BORN"} size='large' />
                                            <h6 className='text-[1.125rem]'>{post.author_name}</h6>
                                        </Link>

                                        <div className='flex items-center gap-5'>
                                            <time className='flex items-center gap-1 text-muted-foreground text-sm'>
                                                <Clock size={14} />
                                                {post.created_at ? format(post.created_at?.toDate(), 'dd MMM, yyyy') : 'Invalid date'}
                                            </time>

                                            <p className='flex items-center gap-1 text-muted-foreground text-sm'>
                                                <Book size={14} />
                                                {timetoRead} min read
                                            </p>
                                        </div>
                                    </div>


                                    {
                                        user &&
                                        <div className='flex items-center gap-6'>
                                            <Tooltip content='Total reads' className='flex items-center gap-1'>
                                                <Eye className='text-foreground cursor-pointer' />
                                                {post.total_reads || 0}
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

                                            <Tooltip content='See comments' className='flex items-center gap-1 mr-1'>
                                                <Link href={`/p/${post_id}/discuss`}>
                                                    <MessageSquareText className='text-foreground cursor-pointer' />
                                                </Link>
                                            </Tooltip>

                                            <Tooltip content='Share post' className='flex items-center gap-1'>
                                                <Share2 onClick={openShareModal} className='text-foreground cursor-pointer' />
                                            </Tooltip>

                                        </div>
                                    }

                                </div>
                            </header>




                            <div className='grid md:grid w-full max-w-[750px] mx-auto pb-16 border-b border-muted-foreground'>
                                <div className='articleContent' dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>



                            <footer className='flex flex-col items-center gap-5 w-full max-w-[750px] mx-auto'>
                                <div className='flex max-md:flex-col md:items-center md:justify-between gap-2.5 w-full py-4 sm:py-6 border-b border-muted-foreground'>
                                    <div className='flex items-center gap-3'>
                                        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
                                            <Avatar alt={post.author_username} src={post.author_avatar} fallback={post.author_name || "AUGE BORN"} size='large' />
                                            <h6 className='text-[1.125rem]'>{post.author_name}</h6>
                                        </Link>
                                        <Badge variant="secondary">Author</Badge>
                                    </div>


                                    {
                                        user?.uid !== post.author_id &&
                                        <Button onClick={followUnfollow} className='flex items-center gap-1.5 w-max' variant="secondary">
                                            {
                                                isUnfollowingUser || isFollowingUser ?
                                                    <SmallSpinner className='text-primary' />
                                                    :

                                                    userFollows?.includes(post.author_id || "") ?
                                                        isUnfollowingUser ? "Unfollowing" : "Unfollow"
                                                        :
                                                        isFollowingUser ? "Following" : "Follow"
                                            }
                                        </Button>
                                    }
                                </div>


                                {
                                    post.tags && post.tags.length > 0 &&
                                    <div className='flex items-center flex-wrap gap-2'>
                                        {
                                            post.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className='text-sm font-normal'>
                                                    <Link href={`/tags/${tag.toLowerCase()}`}>
                                                        {tag}
                                                    </Link>
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                }
                            </footer>


                            {
                                user &&
                                <div className={cn('sticky bottom-[2vh] flex items-center justify-center gap-6 mx-auto my-3 mt-8 py-3 px-7 bg-primary-foreground rounded-full drop-shadow-sm shadow-lg', inView && "!relative")}>
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

                                    <Tooltip content='Share post' className='flex items-center gap-1 mr-1.5'>
                                        <Share2 onClick={openShareModal} className='text-foreground cursor-pointer' />
                                    </Tooltip>

                                    <Tooltip content='See comments' className='flex items-center gap-1'>
                                        <Link href={`/p/${post_id}/discuss`}>
                                            <MessageSquareText className='text-foreground cursor-pointer' />
                                        </Link>
                                    </Tooltip>

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

                                    {
                                        (user && user.uid === post.author_id) &&
                                        <Tooltip content="More">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className='ml-auto'>
                                                    <Ellipsis />
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align='end' className='flex flex-col p-0 w-max xl:w-48 max-md:gap-1'>
                                                    <DropdownMenuItem className='rounded-none'>
                                                        <button onClick={openShareModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                                                            <Share2 className='size-[20px]' /> Share Post
                                                        </button>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem className='rounded-none'>
                                                        <Link href={`/new?edit=${post.post_id}`} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                                                            <PenBoxIcon className='size-[20px]' />Edit Post
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem className='rounded-none'>
                                                        <Link href={`/p/${post.post_id}/analytics`} className='flex items-center gap-2.5 w-full pb-1.5 pt-2 px-1.5 text-[1.02rem] max-md:text-base'>
                                                            <TrendingUp className='size-[20px]' /> View analytics
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <button onClick={openConfirmDeleteModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base text-red-400'>
                                                            <Trash className='size-[20px] text-red-400' />Delete Post
                                                        </button>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </Tooltip>
                                    }
                                </div>
                            }
                        </div>
                        :
                        <div>
                            Post not found
                        </div>

            }

            {
                !isLoading && post &&
                <>
                    <PostShareModal
                        post={post || {} as TPost}
                        isModalOpen={isShareModalOpen}
                        closeModal={closeShareModal}
                    />
                    <ConfirmDeleteModal
                        isModalOpen={isConfirmDeleteModalOpen}
                        closeModal={closeConfirmDeleteModal}
                        deleteFunction={handleDelete}
                        title="Delete Post"
                        isDeletePending={isDeletingComment}
                    >
                        <p>Are you sure you want to delete this post?. Please note that this action is irreversible</p>
                    </ConfirmDeleteModal>
                </>
            }
            {
                !isLoading && post &&
                <footer className='p-5'>

                </footer>
            }
        </main>
    )
}

export default PostDetailsPage