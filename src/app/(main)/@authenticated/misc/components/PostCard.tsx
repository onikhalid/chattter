import React, { useContext } from 'react'
import Link from 'next/link'
import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import { Avatar, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Tooltip } from '@/components/ui'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis, Trash, PenBoxIcon, Eye, UserPlus, Share } from 'lucide-react'
import Image from 'next/image'
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'
import { UseAddPostToBookmark, UseFollowUser, UseRemovePostFromBookmark, UseUnFollowUser } from '../api'
import { SmallSpinner } from '@/components/icons'
import { UserContext } from '@/contexts'
import { launchNotification } from '@/utils/notifications'
import { useBooleanStateControl } from '@/hooks'
import PostShareModal from './PostShareModal'
import { TPost } from '../types'
import { format } from 'date-fns'

interface Props {
  post: TPost
}
const PostCard: React.FC<Props> = ({ post }) => {
  const [user, loading] = useAuthState(auth)
  const { userFollows } = useContext(UserContext)
  const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark({})
  const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark({})
  const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
  const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
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
    } else if (user) {
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
    } else if (user) {
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




  return (
    <article className='flex flex-col gap-4 py-5 px-2 xl:px-4'>
      <header className='flex items-center gap-4'>
        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
          <Avatar alt={post.author_username} src={post.author_avatar} fallback={"AUGE BORN"} />
          <h6>{post.author_name}</h6>
        </Link>
        <time className='text-muted-foreground text-sm'>{format(post.created_at.toDate(), 'dd MMM, yyyy')}</time>


        <DropdownMenu>
          <DropdownMenuTrigger className='ml-auto'>
            <Ellipsis />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/p/${post.post_id}`} className='flex items-center gap-1.5 w-full'>
                <Eye size={16} /> Read
              </Link>
            </DropdownMenuItem>
            {
              user?.uid === post.author_id &&
              <>
                <DropdownMenuItem>
                  <Link href={`/new?edit=${post.post_id}`} className='flex items-center gap-1.5 w-full'>
                    <PenBoxIcon size={15} />Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/p/${post.post_id}/delete`} className='flex items-center gap-1.5 w-full'>
                    <Trash size={15} />Delete
                  </Link>
                </DropdownMenuItem>
              </>
            }
            {
              user?.uid !== post.author_id &&
              <>
                <DropdownMenuItem>
                  <button onClick={followUnfollow} className='flex items-center gap-1.5 w-full'>
                    {
                      isUnfollowingUser || isFollowingUser ?
                        <SmallSpinner className='text-primary' />
                        :
                        <UserPlus size={15} />
                    }

                    {
                      userFollows?.includes(user?.uid || "") ?
                        isUnfollowingUser ? "Unfollowing" : "Unfollow"
                        :
                        isFollowingUser ? "Following" : "Follow"
                    }
                    Author
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/p/${post.post_id}/delete`} className='flex items-center gap-1.5 w-full'>
                    <Trash size={15} />Delete
                  </Link>
                </DropdownMenuItem>
              </>
            }
            <DropdownMenuItem>
              <button onClick={openShareModal} className='flex items-center gap-1.5 w-full'>
                <Share size={15} /> Share
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>


      <Link href={`/p/${post.post_id}`} className='inline-block'>
        <section className='flex max-md:flex-col-reverse items-stretch justify-between gap-8'>
          <div>
            <h2 className='text-2xl font-medium h-[2lh]  max-w-[90%] text-balance [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:2]'>{post.title}</h2>
            <p className='text-muted-foreground max-w-[45ch] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:3]'>
              {cleanUpPostQuillEditorContent(post.content || "")}
            </p>
          </div>

          <div className='relative w-full md:max-w-[250px] h-[150px] aspect-[16/9] '>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              objectFit='cover'
            />
          </div>
        </section>
      </Link>


      <footer className='flex items-center'>
        <LinkButton href={`/p/${post.post_id}`} variant='unstyled' shape='square' className='flex items-center  gap-1 group/read border-transparent rounded-none px-1 pb-1 border-b-2 hover:border-b-primary hover:gap-2 transition-all duration-300'>
          Read Post <ArrowRight size={18} className='-rotate-45' />
        </LinkButton>

        <div className='flex items-center gap-2 ml-auto'>
          <Badge variant="secondary">{post.reads?.length || 0} reads</Badge>
          {
            post.tags.length &&
            <Tooltip content='See more related posts'>
              <Link href={`/tags/${post.tags[0]}`} passHref>
                <Badge>{post.tags[0]}</Badge>
              </Link>
            </Tooltip>
          }

          {
            user &&
            <Tooltip content={post.bookmarks?.includes(user?.uid) ? "Remove post from archive" : "Save post"}>
              {
                isSavingBookmark || isRemovingBookmark ?
                  <SmallSpinner className='text-primary' />
                  :
                  post.bookmarks?.includes(user?.uid) ?
                    <BookmarkX onClick={saveUnsave} className='text-foreground stroke-[2.5px] cursor-pointer fill-foreground' />
                    :
                    <BookmarkPlus onClick={saveUnsave} className='text-foreground hover:text-primary cursor-pointer' />
              }
            </Tooltip>
          }
        </div>
      </footer>

      <PostShareModal
        post={post}
        isModalOpen={isShareModalOpen}
        closeModal={closeShareModal}
      />
    </article>
  )
}

export default PostCard