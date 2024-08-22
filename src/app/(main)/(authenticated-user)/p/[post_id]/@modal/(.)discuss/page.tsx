'use client'
import React from 'react'
import { CommentsDrawer } from '@/app/(main)/(authenticated-user)/misc/components'

const InterceptedDiscussPage = ({ params: { post_id } }: { params: { post_id: string } }) => {
  return (
    <CommentsDrawer searchParams={{ post_id }} />
  )
}

export default InterceptedDiscussPage