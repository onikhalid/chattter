import { getDoc, doc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";
import { TPost } from "@/app/(main)/@authenticated/misc/types";

const fetchPostToEdit = async (postId: string) => {
  const postToEditRef = doc(db, `posts/${postId}`);
  const postToEditSnap = await getDoc(postToEditRef);
  if (postToEditSnap.exists()) {
    return postToEditSnap.data() as TPost;
  } else {
    throw new Error("Post not found");
  }
};

 const UseGetPostDetails = (postId:string | null | undefined) => {
    return useQuery({
        queryKey: ["get-single-post-details", postId],
        queryFn: () => fetchPostToEdit(postId||""),
        enabled: !!postId,
      });
}

export default UseGetPostDetails;   