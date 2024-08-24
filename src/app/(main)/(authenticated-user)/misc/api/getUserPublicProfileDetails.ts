import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useQuery } from '@tanstack/react-query';
import { TBookmark, TComment, TPost } from '../types';
import { TUser } from '@/contexts';



export const getUserPublicProfileDetails = async (username: string) => {
  const usersCollectionRef = collection(db, "users");
  let q = query(
    usersCollectionRef,
    where("username", "==", decodeURIComponent(username)),
  );
  const snapshot = await getDocs(q);
  const userDetails = snapshot.docs[0]?.data() as TUser | undefined;
  if (!!userDetails) {
    // const postsCollectionRef = collection(db, "posts");
    // const postQuery = query(postsCollectionRef, where("author_id", "==", userDetails.uid));
    // const postsSnapshot = await getDocs(postQuery);
    // const posts = postsSnapshot.docs.map(doc => doc.data()) as TPost[];

    const bookmarksCollectionRef = collection(db, "bookmarks");
    const bookmarkQuery = query(bookmarksCollectionRef, where("bookmarker_id", "==", userDetails.uid));
    const bookmarksSnapshot = await getDocs(bookmarkQuery);
    const bookmarks = bookmarksSnapshot.docs.map(doc => doc.data()) || [] as TBookmark[];

    const followersCollectionRef = collection(db, "follows");
    const followersQuery = query(followersCollectionRef, where("followed_id", "==", userDetails.uid));
    const followersSnapshot = await getDocs(followersQuery);
    const followers = followersSnapshot.docs.map(doc => doc.data().follower_id) || [] as string[];

    const followingCollectionRef = collection(db, "follows");
    const followingQuery = query(followingCollectionRef, where("follower_id", "==", userDetails.uid));
    const followingSnapshot = await getDocs(followingQuery);
    const following = followingSnapshot.docs.map(doc => doc.data().followed_id) || [] as string[];
    const data = { details: userDetails, bookmarks, followers, following };
    return data;
  }
  else {
    return null;
  }

};

export const UseGetUserPublicProfileDetails = (username: string) => {
  return useQuery({
    queryKey: ['user-public-profile', username],
    queryFn: () => getUserPublicProfileDetails(username),
    // refetchOnWindowFocus: false,
  });
};