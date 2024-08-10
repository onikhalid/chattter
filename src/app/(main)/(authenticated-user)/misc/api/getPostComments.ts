import { collection, query, where, orderBy, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onSnapshot } from 'firebase/firestore';
import { organizeComments } from '../components/CommentsList';
import { TComment } from '../types';



export const getCommentsQuery = (postId: string) => {
    const commentsRef = collection(db, "comments");
    return query(commentsRef, where("post_id", "==", postId), orderBy("created_at", "asc"));
};

export const useGetComments = (postId: string) => {
    return useQuery({
      queryKey: ['comments', postId],
      queryFn: () => 
        new Promise<TComment[]>((resolve) => {
          const unsubscribe = onSnapshot(getCommentsQuery(postId), (snapshot) => {
            const commentsData: TComment[] = snapshot.docs.map(doc => ({
              comment_id: doc.id,
              ...doc.data()
            })) as TComment[];
            resolve(organizeComments(commentsData));
          });
          return () => unsubscribe();
        }),
      refetchOnWindowFocus: false,
    });
  };