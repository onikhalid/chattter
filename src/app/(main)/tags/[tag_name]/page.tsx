import React from 'react'
import PostsByTagList from '../../@authenticated/misc/components/PostsByTag'

const Tags = ({ params }: { params: { tag_name: string } }) => {
    const { tag_name } = params

console.log(tag_name)
    return (
        <main className=''>
            <PostsByTagList tag_name={tag_name} />
        </main>
    )
}

export default Tags