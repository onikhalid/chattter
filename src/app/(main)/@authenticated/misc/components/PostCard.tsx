import React from 'react'
import { TPost } from '../types'
import Link from 'next/link'
import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import { Avatar, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { Ellipsis } from 'lucide-react'

interface Props {
  post: TPost
}
const PostCard: React.FC<Props> = ({ post }) => {
console.log(post) 

  return (
    <article>
      <header className='flex items-center'>
        <Link href={`/u/${post.author_username}`} className='flex items-center gap-2'>
          <Avatar alt={post.author_username} src={post.author_avatar} fallback={"AUGE BORN"} />
          <h6>{post.author_name}</h6>
        </Link>
        <time>{new Date(post.created_at).toDateString()}</time>


        <DropdownMenu>
          <DropdownMenuTrigger>
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

      <Link href={`/p/${post.post_id}`}
        className='inline-block'
      >
        <section className='flex items-center'>

          <div>
            <h2>{post.title}</h2>
            <p>{cleanUpPostQuillEditorContent(post.content || "")}</p>
          </div>
        </section>
      </Link>

      <footer className='flex items-center'>

      </footer>
    </article>
  )
}

export default PostCard