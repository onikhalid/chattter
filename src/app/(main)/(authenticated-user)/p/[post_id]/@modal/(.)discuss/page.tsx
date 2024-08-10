'use client'
import React from 'react'
import { CommentsDrawer } from '@/app/(main)/(authenticated-user)/misc/components'

const InterceptedDiscussPage = ({ searchParams: { post_id } }: { searchParams: { post_id: string } }) => {
  return (
    <CommentsDrawer searchParams={{ post_id }} />
  )
}

export default InterceptedDiscussPage