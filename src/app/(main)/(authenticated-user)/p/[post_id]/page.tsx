import { Suspense } from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { UseGetPostDetails } from '../../new/misc/api'
import { cleanUpPostQuillEditorContent } from '@/utils/quillEditor'
import PostDetailsPage from './PostDetailsPage'
import { Spinner } from '@/components/icons'

type Props = {
    params: { post_id: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post_id = params.post_id
    const { data: post } = UseGetPostDetails(post_id)

    return {
        title: `${post?.title} - Your Site Name`,
        description: `${cleanUpPostQuillEditorContent(post?.content || "").substring(0, 50)}...` || 'Read this interesting post on our blog',
        openGraph: {
            title: post?.title,
            description: `${cleanUpPostQuillEditorContent(post?.content || "").substring(0, 50)}...` || 'Read this interesting post on our blog',
            images: [
                {
                    url: post?.cover_image || '/default-image.png',
                    width: 1200,
                    height: 630,
                    alt: post?.title,
                },
            ],
            url: `https://chattter.vercel.app/p/${post_id}`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: post?.title,
            description: `${cleanUpPostQuillEditorContent(post?.content || "").substring(0, 50)}...` || 'Read this interesting post on our blog',
            images: [post?.cover_image || '/default-image.png'],
        },
    }
}

export default async function PostDetailsPageLayout({ params }: Props) {
    const { post_id } = params
    const { data: post, isLoading } = UseGetPostDetails(post_id)


    return (
        <main className="relative grow flex flex-col w-full px-4 lg:px-[7.5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <Suspense fallback={
                <div className='flex items-center justify-center size-full'>
                    <Spinner className='text-foreground' />
                </div>
            }>
                <PostDetailsPage post={post} post_id={post_id}  isLoading={isLoading} />
            </Suspense>
        </main>
    )
}