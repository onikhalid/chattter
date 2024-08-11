import React from 'react'
import PostsByTagList from '../../misc/components/PostsByTag'

const Tags = ({ params }: { params: { tag_name: string } }) => {
    const { tag_name } = params

    console.log(tag_name)
    return (
        <main className="relative grow w-full flex flex-col-reverse lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <PostsByTagList tag_name={decodeURIComponent(tag_name)} />
        </main>
    )
}
export default Tags