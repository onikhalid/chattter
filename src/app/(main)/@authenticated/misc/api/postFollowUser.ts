
import { doc, collection, updateDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TFollow } from "../types";

const FollowUser = async (followerData: TFollow) => {
    try {
        const { follower_id, followed_id } = followerData
        const followId = `${follower_id}_${followed_id}`
        const followDocRef = doc(collection(db, 'bookmarks'), followId);
        await updateDoc(followDocRef, followerData)
    } catch (error) {
        console.log(error)
    }
};

const UseFollowUser = () => {
    return useMutation({
        mutationKey: ["followUser"],
        mutationFn: FollowUser,
    });
}

export default UseFollowUser;


