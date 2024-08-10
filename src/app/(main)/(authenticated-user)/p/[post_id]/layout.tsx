import React from 'react'

interface PostDetailsLayoutProps {
    children: React.ReactNode
    modal: React.ReactNode
}
const PostDetailsLayout: React.FC<PostDetailsLayoutProps> = ({ children, modal }) => {
    return (
        <>
            {children}
            {modal}
        </>
    )
}

export default PostDetailsLayout