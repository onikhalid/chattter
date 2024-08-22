import { Metadata } from 'next';
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Chattter | Create New Post",
    description: "Create a new post on chatter: No 1 content site for traditional book lovers",
  };

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            {children}
        </Suspense>
    )
}

export default layout