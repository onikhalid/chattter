import React from 'react'
import { TBookmark } from '../types'
import BookmarkCard from './BookmarkCard'
interface Props {
    bookmarks: TBookmark[]
}
const PublicProfileBookmarks: React.FC<Props> = ({ bookmarks }) => {

    return (
        <section className='grow relative flex flex-col w-full max-w-[550px] h-full lg:max-w-[1200px] mx-auto'>
            {
                bookmarks.length === 0 ?
                    <div className='flex items-center justify-center w-full h-full'>
                        <p className='text-muted-foreground text-lg'>
                            No bookmarks
                        </p>
                    </div>
                    :
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 py-8'>
                        {
                            bookmarks.map((bookmark, index) => (
                                <BookmarkCard key={index} bookmark={bookmark} />
                            ))
                        }
                    </div>
            }
        </section>
    )
}

export default PublicProfileBookmarks