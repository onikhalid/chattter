
import { doc, collection, updateDoc, addDoc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TCreateBookmark } from "../types";
import toast from "react-hot-toast";
import { launchNotification } from "@/utils/notifications";

const AddPostToBookmark = async (bookmarkData: TCreateBookmark) => {
    try {
        const { bookmarker_id, post_id } = bookmarkData
        const bookmarkId = `${bookmarker_id}_${post_id}`
        const bookmarkRef = doc(collection(db, 'bookmarks'), bookmarkId);
        const postDocRef = doc(db, `posts/${post_id}`);


        await updateDoc(postDocRef, { bookmarks: arrayUnion(bookmarker_id) })
        await setDoc(bookmarkRef, bookmarkData)
    } catch (error) {
        console.error(error)
    }
};

interface UseAddPostToBookmarkProps {
    post_id?: string;
}
const UseAddPostToBookmark = ({ post_id }: UseAddPostToBookmarkProps) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["addBookmark"],
        onSuccess() {
             if (post_id) {
                queryClient.invalidateQueries({
                    queryKey: ['get-single-post-details', post_id]
                });
            }
        },
        mutationFn: AddPostToBookmark,
    });
}

export default UseAddPostToBookmark;


