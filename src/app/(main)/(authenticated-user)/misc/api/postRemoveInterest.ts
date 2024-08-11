import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';

import { db } from '@/utils/firebaseConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface TRemoveInterest {
  interests: string | string[];
  user_id: string;
}
export const removeInterest = async ({ interests, user_id }: TRemoveInterest) => {
  const userDocRef = doc(db, "users", user_id);
  const res = updateDoc(userDocRef, { interests: arrayRemove(interests) });
  return res;
};


export const useRemoveInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeInterest,
    // onSuccess: (_, variables) => {
    //   queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
    // },
  });
};


