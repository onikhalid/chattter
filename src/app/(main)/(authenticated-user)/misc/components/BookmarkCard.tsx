import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis, Trash, PenBoxIcon, Eye, UserPlus, Share, UserMinus, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import { Avatar, Badge, ConfirmDeleteModal, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Tooltip } from '@/components/ui'
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SmallSpinner } from '@/components/icons'
import { UserContext } from '@/contexts'
import { launchNotification } from '@/utils/notifications'
import { useBooleanStateControl } from '@/hooks'

import { UseAddPostToBookmark, useDeletePost, UseFollowUser, UseRemovePostFromBookmark, UseUnFollowUser } from '../api'
import PostShareModal from './PostShareModal'
import { TBookmark, TPost } from '../types'

interface Props {
    bookmark: TBookmark
}
const BookmarkCard: React.FC<Props> = ({ bookmark }) => {
    const [user, loading] = useAuthState(auth)
    const { userFollows } = useContext(UserContext)
    const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark({})
    const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark({})
    const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
    const followUnfollow = () => {
        if (!loading && !user) {
            launchNotification("error", "Login to follow users")
        } else if (user) {
            const data = {
                follower_id: user.uid || '',
                followed_id: bookmark.post_author_id
            }
            if (userFollows?.includes(bookmark.post_author_id)) {
                unfollowUser(data)
                toast.success(`Unfollowed ${bookmark.post_author_name}`)
            } else {
                followUser(data)
                toast.success(`Followed ${bookmark.post_author_name}`)
            }
        }
    }




    return (
        <article className='flex flex-col rounded-lg overflow-hidden'>
            <div className='relative aspect-[15/9]'>
                <Image
                    src={bookmark.post_cover_image || "/images/placeholder.png"}
                    alt={bookmark.post_title}
                    objectFit='cover'
                    fill
                    className='rounded-lg'
                />
            </div>

            <section className='grow flex flex-col gap-4 px-5 bg-secondary/40 py-4'>
                <h3 className='text-base font-medium text-balance [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:2] px-1.5'>
                    {bookmark.post_title}
                </h3>
                <time className='text-muted-foreground text-sm shrink-0 -mt-2'>{format(bookmark.created_at.toDate(), 'dd MMM, yyyy')}</time>

                <Link href={`/u/${bookmark.post_author_username}`} className='flex items-center gap-2'>
                    <Avatar alt={bookmark.post_author_username} src={bookmark.post_author_avatar} fallback={bookmark.post_author_name || "AUGE BORN"} />
                    <h6 className='truncate'>{bookmark.post_author_name}</h6>
                </Link>

                <footer className='flex items-center justify-between mt-auto'>
                    <LinkButton href={`/p/${bookmark.post_id}`} variant='unstyled' shape='square' className='flex items-center  gap-1 group/read border-transparent rounded-none px-1 pb-1 border-b-2 hover:border-b-primary hover:gap-2 transition-all duration-300'>
                        Read Post <ArrowRight size={18} className='-rotate-45' />
                    </LinkButton>

                    <Tooltip content={"Remove post from archive"}>
                        {
                            isSavingBookmark || isRemovingBookmark ?
                                <SmallSpinner className='text-primary' />
                                :

                                <BookmarkX
                                    onClick={() => deleteBookmark(`${bookmark.bookmarker_id}_${bookmark.post_id}`)}
                                    className='text-foreground stroke-[2.5px] cursor-pointer fill-foreground'
                                />
                        }
                    </Tooltip>
                </footer>
            </section>

        </article>
    )
}

export default BookmarkCard