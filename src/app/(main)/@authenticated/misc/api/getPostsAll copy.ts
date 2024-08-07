import { db } from "@/utils/firebaseConfig";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import { orderBy } from "lodash";





const getPosts = async () => {
  const postsCollectionRef = collection(db, "posts");
  const getQuery = query(postsCollectionRef, orderBy("createdAt", 'desc'), limit(postsPerFetch))





  const q = await getQuery();
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const newDataArray = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      newDataArray.push(data);
    });


    setAllPosts(newDataArray)
    const documents = snapshot.docs;
    setfetchedPosts(documents[documents.length - 1])
    setLoadingPosts(false)
  });
  return unsubscribe;
};



