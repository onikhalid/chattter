'use client'

import React, { useContext, useEffect, useMemo } from 'react'
import { UserContext } from '@/contexts'
import { ArrowRight, BookmarkX, BookmarkPlus, Ellipsis, Trash, PenBoxIcon, Eye, UserPlus, Share, UserMinus, Share2 } from 'lucide-react'

import { TPost } from '../../types'
import { ColumnDef } from "@tanstack/react-table"
import { Button, ConfirmDeleteModal, DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import Link from 'next/link'
import { useBooleanStateControl } from '@/hooks'
import { useDeletePost } from '../../api'
import toast from 'react-hot-toast'

interface Props {
    data: TPost[]
}

const BestPerformingPostsByLikesTable: React.FC<Props> = ({ data }) => {
    const { isUserDataLoading, userData, userFollows, userFollowers, userPosts, userInterests, userBookmarks } = useContext(UserContext)
    const {

        state: isConfirmDeleteModalOpen,
        setTrue: openConfirmDeleteModal,
        setFalse: closeConfirmDeleteModal
    } = useBooleanStateControl()
    const { mutate: deletePost, isPending: isDeletingComment } = useDeletePost()


    const handleDelete = (post_id: string) => {
        const data = { post_id }
        deletePost(data)
        closeConfirmDeleteModal()
        toast.success("Post deleted successfully")
    }

    const columns: ColumnDef<TPost>[] = [

        {
            accessorKey: "author_id",
            header: "S/N",
            cell: ({ row }) => {
                return <div className="text-center font-medium">{row.index + 1}</div>
            },
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "likes.length",
            header: "Likes",
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {

                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="secondary" className="flex items-center gap-1 min-w-max py-1.5">Actions <Ellipsis size={15} className='rotate-90' /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='flex flex-col p-0 w-max xl:w-48 max-md:gap-1'>
                                <DropdownMenuItem className='rounded-none'>
                                    <Link href={`/p/${row.original.post_id}`} className='flex items-center gap-2.5 w-full pb-1.5 pt-2 px-1.5 text-[1.02rem] max-md:text-base'>
                                        <Eye className='size-[20px]' /> Read Post
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='rounded-none'>
                                    <Link href={`/new?edit=${row.original.post_id}`} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base'>
                                        <PenBoxIcon className='size-[20px]' />Edit Post
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <button onClick={openConfirmDeleteModal} className='flex items-center gap-2.5 w-full py-1.5 px-1.5 text-[1.02rem] max-md:text-base text-red-400'>
                                        <Trash className='size-[20px] text-red-400' />Delete Post
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ConfirmDeleteModal
                            isModalOpen={isConfirmDeleteModalOpen}
                            closeModal={closeConfirmDeleteModal}
                            deleteFunction={() => handleDelete(row.original.post_id)}
                            title="Delete Post"
                            isDeletePending={isDeletingComment}
                        >
                            <p>Are you sure you want to delete this post?. Please note that this action is irreversible</p>
                        </ConfirmDeleteModal>
                    </>)
            },
        },
    ]





    return (
        <section className='flex flex-col w-full overflow-x-scroll'>
            {/* <div> */}
                <DataTable columns={columns} data={data} />
            {/* </div> */}
        </section>
    )
}

export default BestPerformingPostsByLikesTable