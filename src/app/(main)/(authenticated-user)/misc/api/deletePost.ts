import { collection, query, where, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TDeletePost {
  post_id: string;
}
export const deletePost = async ({ post_id }: TDeletePost) => {
  const postDocRef = doc(db, "posts", post_id);
  await deleteDoc(postDocRef);
};


export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    // onSuccess: (_, variables) => {
    //   queryClient.invalidateQueries({ queryKey: ['Posts', variables.post_id] });
    // },
  });
};


