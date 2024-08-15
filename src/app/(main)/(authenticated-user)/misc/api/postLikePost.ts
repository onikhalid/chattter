
import { doc, collection, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TLike } from "../types";

const likePost = async (likeData: TLike) => {
    try {
        const { liker_id, post_id } = likeData
        // const likeId = `${liker_id}_${post_id}`
        // const likeDocRef = doc(collection(db, 'likes'), likeId);
        // await setDoc(likeDocRef, likeData)
        const postDocRef = doc(db, `posts/${post_id}`);
        await updateDoc(postDocRef, { likes: arrayUnion(liker_id) })
    } catch (error) {
        console.error(error)
    }
};

interface UseLikePostProps {
    post_id?: string;
}
const UseLikePost =  ({ post_id }: UseLikePostProps) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["likePost"],
        mutationFn: likePost,
        onSuccess() {
            if (post_id) {
               queryClient.invalidateQueries({
                   queryKey: ['get-single-post-details', post_id]
               });
           }
       },
    });
}

export default UseLikePost;


