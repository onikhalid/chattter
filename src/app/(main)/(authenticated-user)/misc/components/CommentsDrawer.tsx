import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui"
import { UserContext } from "@/contexts"

import CommentList from "./CommentsList"
import { useAddNewComment, useCreateNotification, useGetComments } from "../api"
import { CommentCardSkeleton } from "./CommentsCardSkeleton"
import { v4 } from "uuid"
import { UseGetPostDetails } from "../../new/misc/api"



function CommentsDrawer({ searchParams: { post_id } }: { searchParams: { post_id: string } }) {
    const [drawerOpen, setDrawerOpen] = React.useState(true)
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
                        receiver_id: post_id,
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

    const router = useRouter()
    const goBack = () => {
        setDrawerOpen(false)
        router.back()
    }

    return (
        <Drawer direction="right" open onClose={goBack} dismissible shouldScaleBackground>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>

            <DrawerContent direction="right" className="max-w-[500px] " onPointerDownOutside={goBack}>
                <div className="mx-auto w-full h-full overflow-y-scroll px-3 md:px-6">
                    <DrawerHeader className="flex items-center gap-4">
                        <Button variant="outline" className="md:hidden" onClick={goBack}>
                            <ChevronLeft className="cursor-pointer" />
                        </Button>
                        <DrawerTitle className="font-display text-2xl font-normal">Comments ({comments?.length || 0})</DrawerTitle>
                    </DrawerHeader>

                    <div className="p-4 pb-0">
                        <form onSubmit={handleCommentSubmit} className="flex flex-col pb-6 border-b-2 border-muted-foreground">
                            <Textarea
                                value={newComment}
                                onChange={handleCommentChange}
                                placeholder="Write your comment..."
                                className="w-full p-2 border rounded"
                                rows={6}
                                name="new-comment"
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
                            ) : (
                                <CommentList comments={comments || []} />
                            )
                        }
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CommentsDrawer