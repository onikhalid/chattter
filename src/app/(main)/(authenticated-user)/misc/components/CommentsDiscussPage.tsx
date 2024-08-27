import React from 'react'
import { v4 } from 'uuid'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui"
import { UserContext } from "@/contexts"

import CommentList from "./CommentsList"
import { useAddNewComment, useCreateNotification, useGetComments } from "../api"
import { CommentCardSkeleton } from './CommentsCardSkeleton'
import { UseGetPostDetails } from '../../new/misc/api'



const CommentsDiscussPage = ({ post_id }: { post_id: string }) => {
    const { userData } = React.useContext(UserContext)
    const [newComment, setNewComment] = React.useState<string>("");
    const { data: comments, isLoading } = useGetComments(post_id);
    const { mutate: addComment, isPending: isAddingComment } = useAddNewComment();
    const { mutate: sendNotification } = useCreateNotification()
    const { data } = UseGetPostDetails(post_id)

    function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setNewComment(e.target.value);
    }

    function handleCommentSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newComment.trim()) {
            const commentData = {
                post_id,
                commentor_id: userData?.uid || "",
                commentor_username: userData?.username || "",
                commentor_name: userData?.name || "",
                commentor_avatar: userData?.avatar || "",
                content: newComment,
                parent_comment_id: null,
                created_at: new Date(),
            };

            addComment(commentData, {
                onSuccess: () => {
                    setNewComment("");
                    sendNotification({
                        receiver_id: data?.author_id || "",
                        sender_id: userData?.uid || "",
                        notification_type: "POST_COMMENT",
                        sender_details: {
                            user_id: userData?.uid || "",
                            user_name: userData?.name || "Chattter App",
                            user_avatar: userData?.avatar || "",
                            user_username: userData?.username || "chattter",
                        },
                        receiver_details: {
                            user_id: post_id,
                            user_name: "",
                            user_avatar: "",
                            user_username: "",
                        },
                        notification_details: {
                            post_id,
                            post_cover_photo: data?.cover_image || "",
                            post_title: data?.title || "",
                            comment_id: v4(),
                            comment_content: newComment,
                        },
                    });
                },
                onError: (error: any) => {
                    console.error("Error adding comment: ", error);
                }
            });
        }
    }


    return (
        <div className="mx-auto w-full px-3 md:px-6">

            <h2 className="font-display text-2xl font-normal">Comments ({comments?.length || 0})</h2>

            <div className="p-4 pb-0">
                <form onSubmit={handleCommentSubmit} className="flex flex-col pb-6 border-b-2 border-muted-foreground">
                    <Textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Write your comment..."
                        className="w-full p-2 border rounded"
                        rows={6}
                        name='comment'
                    />
                    <Button type="submit" className="mt-2 w-full max-w-max ml-auto" disabled={isAddingComment}>
                        {isAddingComment ? 'Submitting...' : 'Submit Comment'}
                    </Button>
                </form>

                {
                    isLoading ? (
                        <div className="divide-y mb-2">
                            {
                                Array.from({ length: 4 }).map((_, i) => (
                                    <CommentCardSkeleton key={i} />
                                ))
                            }
                        </div>
                    )
                        :
                        !isLoading && comments?.length ?
                            (
                                <CommentList comments={comments || []} />
                            )
                            :
                            (
                                <article className="flex flex-col items-start justify-center py-8">
                                    <h3 className="text-foreground font-display font-medium text-2xl">No comments yet.</h3>
                                    <p className="text-muted-foreground font-display font-medium ">Be the first to comment on this post.</p>
                                </article>
                            )
                }
            </div>
        </div>
    )
}

export default CommentsDiscussPage