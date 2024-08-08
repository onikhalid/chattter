
import { doc, collection, updateDoc, addDoc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TBookmark } from "../types";
import toast from "react-hot-toast";
import { launchNotification } from "@/utils/notifications";

const AddPostToBookmark = async (bookmarkData: TBookmark) => {
    try {
        const { bookmarker_id, post_id } = bookmarkData
        const bookmarkId = `${bookmarker_id}_${post_id}`
        const bookmarkRef = doc(collection(db, 'bookmarks'), bookmarkId);
        // const bookmarkDoc = await getDoc(bookmarkRef);
        const postDocRef = doc(db, `posts/${post_id}`);


        await updateDoc(postDocRef, { bookmarks: arrayUnion(bookmarker_id) })
        await setDoc(bookmarkRef, bookmarkData)
    } catch (error) {
        console.log(error)
    }
};

const UseAddPostToBookmark = (homepage: boolean = false) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["addBookmark"],
        onSettled() {
            if (homepage) {
                queryClient.invalidateQueries({
                    queryKey: ['all-posts']
                });
            }
        },
        mutationFn: AddPostToBookmark,
    });
}

export default UseAddPostToBookmark;


