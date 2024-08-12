
import { doc, collection, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TFollow } from "../types";

const FollowUser = async (followerData: TFollow) => {
    try {
        const { follower_id, followed_id } = followerData
        const followId = `${follower_id}_${followed_id}`
        const followDocRef = doc(collection(db, 'follows'), followId);
        await setDoc(followDocRef, followerData)

        // const followerUserDocRef = doc(collection(db, 'users'), follower_id);
        // await updateDoc(followerUserDocRef, { following: arrayUnion(followed_id) })

        // const followedUserDocRef = doc(collection(db, 'users'), followed_id);
        // await updateDoc(followedUserDocRef, { followers: arrayUnion(follower_id) })
        

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


