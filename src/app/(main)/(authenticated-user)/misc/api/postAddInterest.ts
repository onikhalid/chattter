import { updateDoc, doc, arrayUnion } from 'firebase/firestore';

import { db } from '@/utils/firebaseConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface TAddInterest {
  interests: string | string[];
  user_id: string;
}
export const addInterest = async ({ interests, user_id }: TAddInterest) => {
  const userDocRef = doc(db, "users", user_id);
  const res = updateDoc(userDocRef, { interests: arrayUnion(interests) });
  return res;
};


export const useAddInterest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInterest,
    // onSuccess: (_, variables) => {
    //   queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
    // },
  });
};


