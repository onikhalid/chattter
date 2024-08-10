import { FormEvent, useContext, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChevronDown, Dot, Trash } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { Avatar, Button, Collapsible, CollapsibleTrigger, CollapsibleContent, Textarea, ConfirmDeleteModal } from '@/components/ui';
import { auth, db } from '@/utils/firebaseConfig';
import { UserContext } from '@/contexts';
import CommentList from './CommentsList';
import { cn } from '@/utils/classNames';
import { useBooleanStateControl } from '@/hooks';

import { TComment } from '../types';
import { useDeleteComment } from '../api';



type CommentProps = {
    comment: TComment;
};

export const CommentCard = ({ comment }: CommentProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyComment, setReplyComment] = useState('');
    const [user, loading] = useAuthState(auth)
    const { userData } = useContext(UserContext)
    const {
        state: isConfirmDeleteModalOpen,
        setTrue: openConfirmDeleteModal,
        setFalse: closeConfirmDeleteModal
    } = useBooleanStateControl()
    const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment()


    const handleDelete = () => {
        const data = { comment_id: comment.comment_id, post_id: comment.post_id }
        deleteComment(data)
        closeConfirmDeleteModal()
        toast.success("Comment deleted successfully")
    }


    const handleReply = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (replyComment) {
            const reply = {
                post_id: comment.post_id,
                commentor_id: user?.uid,
                commentor_username: userData?.username,
                commentor_name: userData?.name,
                commentor_avatar: userData?.avatar,
                content: replyComment,
                parent_comment_id: comment.comment_id,
                created_at: new Date(),
            };
            addDoc(collection(db, 'comments'), reply);
            setReplyComment("")
        }
    };
    const [showReplies, setShowReplies] = useState(false);
    const toggleReplies = () => setShowReplies(!showReplies);



    return (
        <article className="my-4 divide-muted-foreground">
            <header className="flex max-md:flex-col items-center gap-1.5">
                <Link className='flex items-center gap-2' href={`/u/${comment.commentor_username}`}>
                    <Avatar
                        src={comment.commentor_avatar}
                        alt={comment.commentor_username}
                        fallback={comment.commentor_name}
                    />
                    <h6 className='font-display'>{comment.commentor_username}</h6>
                </Link>
                <Dot size={10} className='max-md:hidden' />
                <time className='text-[0.8rem] text-muted-foreground'>{format(comment.created_at.toDate(), 'dd MMM, yyyy hh:mm a')}</time>

                {
                    userData?.uid === comment.commentor_id &&
                    <Button variant="destructive" size="sm" className='flex items-center gap-1 ml-auto' onClick={openConfirmDeleteModal}>
                        Delete
                        <Trash size={15} className='text-red-400' />
                    </Button>
                }
            </header>
            <p className='p-1.5 text-muted-foreground text-[0.9rem]'>
                {comment.content}
            </p>

            <footer className='flex items-start gap-1.5'>
                {
                    comment.replies &&

                    <Collapsible className="w-full space-y-2" open={showReplies} >
                        <CollapsibleTrigger className=' w-full' asChild>
                            <div className='flex items-center justify-between w-full'>

                                <Button variant="ghost" size="sm" onClick={() => { setShowReplyForm(false); toggleReplies() }}>
                                    <p className='flex items-center gap-2 text-sm'>
                                        {comment.replies?.length}{" "}
                                        replies
                                        <ChevronDown size={15} className={cn(showReplies && "rotate-180", "transition-all duration-200")} />
                                    </p>
                                </Button>

                                {
                                    showReplyForm ?
                                        <Button variant="ghost" size="sm" onClick={() => { setShowReplyForm(false); }}>
                                            Cancel
                                        </Button>
                                        :
                                        <Button variant="ghost" size="sm" onClick={() => { setShowReplyForm(true); setShowReplies(true) }}>
                                            Reply
                                        </Button>
                                }
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-2 transition-[height]">
                            <div className='ml-6'>
                                {
                                    showReplyForm &&
                                    <form onSubmit={(e) => handleReply(e)} className="flex flex-col pb-2">
                                        <Textarea
                                            value={replyComment}
                                            onChange={(e) => setReplyComment(e.target.value)}
                                            placeholder="Write your comment..."
                                            className="w-full p-2 border rounded"
                                            rows={6}
                                        />
                                        <Button type="submit" variant="ghost" className="mt-2 w-full max-w-max ml-auto">
                                            Reply Comment
                                        </Button>
                                    </form>
                                }
                                <CommentList comments={comment.replies} className="pl-4 border-l-[0.35px] border-l-muted-foreground/50" />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                }
            </footer>

            <ConfirmDeleteModal
                isModalOpen={isConfirmDeleteModalOpen}
                closeModal={closeConfirmDeleteModal}
                deleteFunction={handleDelete}
                title="Delete Comment"
                isDeletePending={isDeletingComment}
            >
                <p>Are you sure you want to delete this comment?. Please note that this action is irreversible</p>
            </ConfirmDeleteModal>
        </article>
    );
};