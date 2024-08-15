
import { doc, collection, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TLike } from "../types";

const UnlikeUser = async (likerData: TLike) => {
    try {
        const { liker_id, post_id } = likerData
        // const likeId = `${liker_id}_${post_id}`
        // const likeDocRef = doc(collection(db, 'likes'), likeId);
        // await deleteDoc(likeDocRef)
        const postDocRef = doc(db, `posts/${post_id}`);
        await updateDoc(postDocRef, { likes: arrayRemove(liker_id) })
    } catch (error) {
        console.error(error)
    }
};

interface UseLikePostProps {
    post_id?: string;
}
const UseUnlikeUser = ({ post_id }: UseLikePostProps) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["unlikePost"],
        mutationFn: UnlikeUser,
        onSuccess() {
            if (post_id) {
               queryClient.invalidateQueries({
                   queryKey: ['get-single-post-details', post_id]
               });
           }
       },
    });
}

export default UseUnlikeUser;


