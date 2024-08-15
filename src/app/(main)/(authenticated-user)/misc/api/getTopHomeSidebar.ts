import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebaseConfig';
import { useQuery } from '@tanstack/react-query';
import { TPost } from '../types';
import { TUser } from '@/contexts';




export const getTopHomeSidebar = async () => {
  const usersCollectionRef = collection(db, "users");
  const postsCollectionRef = collection(db, "posts");
  const followsCollectionRef = collection(db, "follows");



  // Fetch top posts sorted by likes + total_reads
  const postQuery = query(postsCollectionRef, orderBy("likes", "desc"));
  const postSnapshot = await getDocs(postQuery);
  const topPosts = postSnapshot.docs.map((doc) => doc.data() as TPost)
    .sort((a, b) => ((b.likes?.length || 0) + (b.total_reads || 0)) - ((a.likes?.length || 0) + (a.total_reads || 0)));

  // Fetch top users based on follow count
  const followsSnapshot = await getDocs(followsCollectionRef);
  const userFollowCounts: Record<string, number> = {};

  // followsSnapshot.forEach((doc) => {
  //   const followData = doc.data();
  //   followData.followed_id.forEach((userId: string) => {
  //     userFollowCounts[userId] = (userFollowCounts[userId] || 0) + 1;
  //   });
  // });

  // const topUserIds = Object.entries(userFollowCounts)
  //   .sort(([, aCount], [, bCount]) => bCount - aCount)
  //   .slice(0, 10)
  //   .map(([userId]) => userId);

  // const topUsers = await Promise.all(
  //   topUserIds.map(async (userId) => {
  //     const userDoc = await getDocs(query(usersCollectionRef, where("uid", "==", userId)));
  //     return userDoc.docs[0]?.data() as TUser;
  //   })
  // );
  const topUsers = [""]
  return {
    topPosts,
    topUsers,
  };
};

// Hook to use top home sidebar data
export const UseGetTopHomeSidebar = () => {
  return useQuery({
    queryKey: ['homepage-sidebar-stats'],
    queryFn: getTopHomeSidebar,
    // refetchOnWindowFocus: false,
  });
};
