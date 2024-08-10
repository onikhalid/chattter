import { collection, query, where, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TDeleteComment {
    comment_id: string;
    post_id: string;
    }
export const deleteComment = async ({comment_id, post_id}: TDeleteComment) => {
  const commentDOcRef = doc(db, "comments", comment_id);
   await deleteDoc(commentDOcRef);
};


export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
    },
  });
};


  