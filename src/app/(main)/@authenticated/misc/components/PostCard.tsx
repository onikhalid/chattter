import React from 'react'
import { TPost } from '../types'
import Link from 'next/link'
import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import { Avatar, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Tooltip } from '@/components/ui'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis } from 'lucide-react'
import Image from 'next/image'
import { auth } from '@/utils/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'
import { UseAddPostToBookmark, UseRemovePostFromBookmark } from '../api'
import { SmallSpinner } from '@/components/icons'

interface Props {
  post: TPost
}
const PostCard: React.FC<Props> = ({ post }) => {
  const [user, loading] = useAuthState(auth)
  const { mutate: addBookmark, isPending: isSavingBookmark } = UseAddPostToBookmark()
  const { mutate: deleteBookmark, isPending: isRemovingBookmark } = UseRemovePostFromBookmark()


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


  return (
    <article className='flex flex-col gap-4 py-5 px-2'>
      <header className='flex items-center'>
        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
          <Avatar alt={post.author_username} src={post.author_avatar} fallback={"AUGE BORN"} />
          <h6>{post.author_name}</h6>
        </Link>
        <time>{new Date(post.created_at).toDateString()}</time>


        <DropdownMenu>
          <DropdownMenuTrigger className='ml-auto'>
            <Ellipsis />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={`/p/${post.post_id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/p/${post.post_id}/delete`}>Delete </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Link href={`/p/${post.post_id}`} className='inline-block'>
        <section className='flex items-stretch justify-between gap-8'>
          <div>
            <h2 className='text-2xl font-medium h-[2lh]'>{post.title}</h2>
            <p className='text-muted-foreground max-w-[45ch] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [overflow-wrap:anywhere] [-webkit-line-clamp:3]'>
              {cleanUpPostQuillEditorContent(post.content || "")}
            </p>
          </div>

          <div className='relative max-w-[150px] h-[150px] aspect-square '>
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
            <>
              {
                isSavingBookmark || isRemovingBookmark ?
                  <SmallSpinner className='text-primary' />
                  :
                  post.bookmarks?.includes(user?.uid) ?
                    <BookmarkX onClick={saveUnsave} className='text-foreground stroke-[2.5px] cursor-pointer fill-foreground' />
                    :
                    <BookmarkPlus onClick={saveUnsave} className='text-foreground hover:text-primary cursor-pointer' />
              }
            </>
          }
        </div>
      </footer>
    </article>
  )
}

export default PostCard