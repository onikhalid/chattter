import { doc, collection, updateDoc, addDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TCreatePost } from "../types";

const createNewPost = async (postData: TCreatePost) => {
    try {
        const postCollectionRef = collection(db, "posts");
        const newPostRef = await addDoc(postCollectionRef, postData);
        const postId = newPostRef.id
        await updateDoc(doc(postCollectionRef, newPostRef.id), {
            post_id: postId
        });
        return newPostRef
    } catch (error) {
        console.log(error)
    }
};

const UseCreateNewPost = () => {
    return useMutation({
        mutationKey: ["createNewPost"],
        mutationFn: createNewPost,
    });
}

export default UseCreateNewPost;   