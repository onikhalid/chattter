import { collection, query, where, orderBy, addDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onSnapshot } from 'firebase/firestore';
import { organizeComments } from '../components/CommentsList';
import { TComment, TPost } from '../types';



export const getUserProfileData = async (username: string) => {
  const usersCollectionRef = collection(db, "users");
  let q = query(
    usersCollectionRef,
    where("username", "==", username),
  );
  const snapshot = await getDocs(q);

  const userDetails = snapshot.docs[0]?.data();
  if (userDetails) {
    const postsCollectionRef = collection(db, "posts");
    const q = query(
      postsCollectionRef,
      where("author_id", "==", userDetails.uid)
    );
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map(doc => doc.data()) as TPost[];
    return { details: userDetails, posts };
  } else {
    return { details: null, posts: [] };
  }

};

export const useGetComments = (username: string) => {
  return useQuery({
    queryKey: ['comments', username],
    queryFn: () => getUserProfileData(username),
    refetchOnWindowFocus: false,
  });
};