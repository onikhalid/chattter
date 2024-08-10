
import { doc, collection, updateDoc, deleteDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TFollow } from "../types";

const UnFollowUser = async (followerData: TFollow) => {
    try {
        const { follower_id, followed_id } = followerData
        const followId = `${follower_id}_${followed_id}`
        const followDocRef = doc(collection(db, 'follows'), followId);
        await deleteDoc(followDocRef)
    } catch (error) {
        console.log(error)
    }
};

const UseUnFollowUser = () => {
    return useMutation({
        mutationKey: ["unfollowUser"],
        mutationFn: UnFollowUser,
    });
}

export default UseUnFollowUser;


