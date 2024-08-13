import { db } from "@/utils/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { TPost } from "../types";

const getPosts = async ({ user_id }: { user_id: string }) => {
    const postsCollectionRef = collection(db, "posts");
    const q = query(
        postsCollectionRef,
        where("author_id", "==", user_id),
        // orderBy("created_at", 'desc'),
        // limit(POSTS_PER_FETCH)
    );

    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map(doc => {
        return doc.data() as TPost;

    });



    return posts
}

