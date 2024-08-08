import { doc, collection, updateDoc, addDoc, getDoc, setDoc, arrayUnion, deleteDoc, writeBatch, query, where, getDocs, arrayRemove } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/utils/firebaseConfig";


const RemovePostFromBookmark = async (bookmark_id: string) => {
  try {
    const bookmarker_id = bookmark_id.split('_')[0]
    const post_id = bookmark_id.split('_')[1]
    const bookmarkRef = doc(collection(db, 'bookmarks'), bookmark_id);
    const postDocRef = doc(db, `posts/${post_id}`);
    await deleteDoc(bookmarkRef)
    await updateDoc(postDocRef, { bookmarks: arrayRemove(bookmarker_id) })

    const allFoldersWithBookmarkQuery = query(collection(db, 'folders'), where('bookmarks', 'array-contains', bookmark_id));
    const allFoldersWithBookmarkSnap = await getDocs(allFoldersWithBookmarkQuery)

    allFoldersWithBookmarkSnap.docs.forEach(async (folder) => {
      const folderDocRef = doc(db, `folders/${folder.data().folder_id}`)
      await updateDoc(folderDocRef, { bookmarks: arrayRemove(bookmark_id) })
    })
  }
  catch (error) {
    console.log(error)
  }
};

interface UseRemovePostFromBookmarkProps {
  homepage?: boolean;
  post_id?: string;
}
const UseRemovePostFromBookmark = ({ homepage = false, post_id }: UseRemovePostFromBookmarkProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["removeBookmark"],
    mutationFn: RemovePostFromBookmark,
    onSuccess() {
      if (post_id) {
        queryClient.invalidateQueries({
          queryKey: ['get-single-post-details', post_id]
        });
      }
    },
  });
}

export default UseRemovePostFromBookmark;


