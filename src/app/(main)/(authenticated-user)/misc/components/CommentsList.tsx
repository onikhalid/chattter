import { cn } from '@/lib/utils';
import { CommentCard } from './CommentsCard';
import { TComment } from '../types';





type CommentListProps = {
    comments: TComment[];
    className?: string;
};

 const CommentList = ({ comments,  className }: CommentListProps) => {
    return (
        <div className={cn("divide-y mb-2", className)}>
            {
                comments.map(comment => (
                    <div key={comment.comment_id} className=''>
                        <CommentCard comment={comment} />
                    </div>
                ))
            }
        </div>
    );
};
export default CommentList; 

export const organizeComments = (comments: TComment[]): TComment[] => {
    const commentMap = new Map<string, TComment>();

    comments.forEach(comment => {
        commentMap.set(comment.comment_id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
        if (comment.parent_comment_id) {
            const parentComment = commentMap.get(comment.parent_comment_id);
            if (parentComment) {
                parentComment.replies!.push(comment);
            }
        }
    });

    return Array.from(commentMap.values()).filter(comment => !comment.parent_comment_id);
};

