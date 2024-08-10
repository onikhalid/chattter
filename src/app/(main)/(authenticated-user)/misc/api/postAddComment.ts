import { collection, query, where, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { TCreateComment } from "@/app/(main)/@authenticated/misc/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';


export const addComment = async (commentData: Omit<TCreateComment, 'comment_id'>) => {
  const commentsRef = collection(db, "comments");
  const docRef = await addDoc(commentsRef, { ...commentData });
  const commentDocRef = doc(db, "comments", docRef.id);
  updateDoc(commentDocRef, { comment_id: docRef.id });
  return docRef.id;
};


export const useAddNewComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
    },
  });
};


