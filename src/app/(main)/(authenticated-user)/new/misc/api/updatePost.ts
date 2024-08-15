import { doc, collection, updateDoc, addDoc } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TUpdatePost } from "../types";

const updatePost = async (postData: TUpdatePost) => {
    try {
        const postCollectionRef = collection(db, "posts");
        // const newPostRef = await addDoc(postCollectionRef, postData);
        // const postId = newPostRef.id
        const ref = await updateDoc(doc(postCollectionRef, postData.post_id), {
            ...postData
        });
        return ref
    } catch (error) {
        console.error(error)
    }
};

const UseUpdatePost = () => {
    return useMutation({
        mutationKey: ["updatePost"],
        mutationFn: updatePost,
    });
}

export default UseUpdatePost;   