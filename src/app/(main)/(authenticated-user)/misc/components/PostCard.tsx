import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis, Trash, PenBoxIcon, Eye, UserPlus, Share, UserMinus, Share2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import { Avatar, Badge, ConfirmDeleteModal, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Tooltip } from '@/components/ui'
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { SmallSpinner } from '@/components/icons'
import { UserContext } from '@/contexts'
import { launchNotification } from '@/utils/notifications'
import { useBooleanStateControl } from '@/hooks'

import { UseAddPostToBookmark, useCreateNotification, useDeletePost, UseFollowUser, UseRemovePostFromBookmark, useStartChat, UseUnFollowUser } from '../api'
import PostShareModal from './PostShareModal'
import { TPost } from '../types'


interface Props {
  post: TPost
  isFromProfile?: boolean
  refetch?: () => void
}
const PostCard: React.FC<Props> = ({ post, isFromProfile, refetch }) => {
  const [user, loading] = useAuthState(auth)
  const { userFollows, userData } = useContext(UserContext)
  const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark({})
  const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark({})
  const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
  const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
  const { mutate: sendNotification } = useCreateNotification()
  const { mutate: startChat, isPending: isStartingChat } = useStartChat()
  const { mutate: deletePost, isPending: isDeletingComment } = useDeletePost()


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


  const handleDelete = () => {
    const data = { post_id: post.post_id }
    deletePost(data)
    closeConfirmDeleteModal()
    toast.success("Post deleted successfully")
  }

  const saveUnsave = () => {
    if (!loading && !user) {
      toast.error("Login to save posts", {
        position: "top-center",
        duration: 4000
      })
      return
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
          post_author_avatar: post.author_avatar,
          created_at: new Date()
        }
        addBookmark(bookmarkData, {
          onSuccess() {
            sendNotification({
              receiver_id: post.author_id,
              sender_id: user.uid,
              notification_type: "POST_SAVED",
              sender_details: {
                user_id: user.uid,
                user_name: user.displayName || 'Chattter App',
                user_avatar: user.photoURL || userData?.avatar || '',
                user_username: userData?.username || user.uid || 'chattter'
              },
              receiver_details: {
                user_id: post.author_id,
                user_name: post.author_name || 'Chattter App',
                user_avatar: post.author_avatar || '',
                user_username: post.author_username || 'chattter'
              },
              notification_details: {
                post_id: post.post_id,
                post_cover_photo: post.cover_image,
                post_title: post.title,
                post_author_avatar: post.author_avatar,
                post_author_name: post.author_name,
                post_author_username: post.author_username
              }
            })
          },
        })
      }
    }
    if (isFromProfile && refetch) {
      refetch()
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
      if (userFollows?.includes(post.author_id)) {
        unfollowUser(data)
        toast.success(`Unfollowed ${post.author_name}`)
      } else {
        followUser(data, {
          onSuccess() {
            sendNotification({
              receiver_id: post.author_id,
              sender_id: user.uid,
              notification_type: "NEW_FOLLOWER",
              sender_details: {
                user_id: user.uid,
                user_name: user.displayName || 'Chattter App',
                user_avatar: user.photoURL || userData?.avatar || '',
                user_username: userData?.username || user.uid || 'chattter'
              },
              receiver_details: {
                user_id: post.author_id,
                user_name: post.author_name || 'Chattter App',
                user_avatar: post.author_avatar || '',
                user_username: post.author_username || 'chattter'
              },
              notification_details: {}
            })
          },
        })
        toast.success(`Followed ${post.author_name}`)
      }
    }
    if (isFromProfile && refetch) {
      refetch()
    }
  }

  const router = useRouter()
  const handleStartChat = () => {
    startChat({
      sender_details: {
        name: userData?.name|| user?.displayName || 'Chattter App',
        avatar: userData?.avatar ||  user?.photoURL  || '',
        id: userData?.uid ||user?.uid || ''
      },
      receiver_details: {
        name: post.author_name || 'AUGE BORN',
        avatar: post.author_avatar || '',
        id: post.author_id || ''
      }
    }, {
      onSuccess(data) {
        router.push(`/chats?chat=${data}`)
      },
    })
  }



  return (
    <article className='flex flex-col gap-4 py-5 px-2 xl:px-4'>
      <header className='flex items-center gap-4'>
        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
          <Avatar alt={post.author_username} src={post.author_avatar} fallback={post.author_name || "AUGE BORN"} />
          <h6>{post.author_name}</h6>
        </Link>
        <time className='text-muted-foreground text-sm'>{format(post.created_at.toDate(), 'dd MMM, yyyy')}</time>


        <DropdownMenu>
          <DropdownMenuTrigger className='ml-auto'>
            <Ellipsis />
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='flex flex-col p-0 w-max xl:w-48 max-md:gap-1'>
            <DropdownMenuItem className='rounded-none'>
              <Link href={`/p/${post.post_id}`} className='flex items-center gap-2.5 w-full pb-1.5 pt-2 px-1.5 text-[1.02rem] max-md:text-base'>
                <Eye className='size-[20px]' /> Read Post
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className='rounded-none'>
              <button onClick={openShareModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                <Share2 className='size-[20px]' /> Share Post
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem className='rounded-none'>
              <button onClick={openShareModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                <Share2 className='size-[20px]' /> Share Post
              </button>
            </DropdownMenuItem>
            {
              user?.uid === post.author_id &&
              <>
                <DropdownMenuItem className='rounded-none'>
                  <Link href={`/new?edit=${post.post_id}`} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                    <PenBoxIcon className='size-[20px]' />Edit Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={openConfirmDeleteModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base text-red-400'>
                    <Trash className='size-[20px] text-red-400' />Delete Post
                  </button>
                </DropdownMenuItem>
              </>
            }
            {
              user?.uid !== post.author_id &&
              <>
                <DropdownMenuItem className='rounded-none'>
                  <button onClick={followUnfollow} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                    {
                      isUnfollowingUser || isFollowingUser ?
                        <SmallSpinner className='text-primary' />
                        :
                        userFollows?.includes(post.author_id || "") ?
                          <UserMinus className='size-[20px]' />
                          :
                          <UserPlus className='size-[20px]' />
                    }

                    {
                      userFollows?.includes(post.author_id || "") ?
                        isUnfollowingUser ? "Unfollowing" : "Unfollow"
                        :
                        isFollowingUser ? "Following" : "Follow"
                    }
                    {" "} Author
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem className='rounded-none'>
                  <button onClick={handleStartChat} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                    <MessageCircle className='size-[20px]' /> Chat with Author
                    {
                      isStartingChat && <SmallSpinner className='text-primary' />
                    }
                  </button>
                </DropdownMenuItem>
              </>
            }

          </DropdownMenuContent>
        </DropdownMenu>
      </header>


      <Link href={`/p/${post.post_id}`} className='inline-block'>
        <section className='flex max-md:flex-col-reverse items-stretch justify-between gap-8'>
          <div>
            <h2 className='text-2xl font-medium h-[2lh]  max-w-[90%] text-balance [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:2]'>{post.title}</h2>
            <p className='text-muted-foreground max-w-[45ch] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:3]'
              dangerouslySetInnerHTML={{ __html: cleanUpPostQuillEditorContent(post.content) }}
            />
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
          <Badge variant="secondary">{post.total_reads || 0} reads</Badge>
          {
            post.tags.length &&
            <Tooltip content='See more related posts'>
              <Link href={`/tags/${post.tags[0].toLowerCase()}`} passHref>
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

      <ConfirmDeleteModal
        isModalOpen={isConfirmDeleteModalOpen}
        closeModal={closeConfirmDeleteModal}
        deleteFunction={handleDelete}
        title="Delete Post"
        isDeletePending={isDeletingComment}
      >
        <p>Are you sure you want to delete this post?. Please note that this action is irreversible</p>
      </ConfirmDeleteModal>
    </article>
  )
}

export default PostCard