import { useInfiniteQuery, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { TPost } from '../types';

const POSTS_PER_FETCH = 10;

export interface QueryResult {
  posts: TPost[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type QueryKey = ['all-posts'];

const getPosts = async ({ pageParam = null }: QueryFunctionContext<QueryKey, QueryDocumentSnapshot<DocumentData> | null>): Promise<QueryResult> => {
  const postsCollectionRef = collection(db, "posts");
  let q = query(
    postsCollectionRef,
    orderBy("created_at", 'desc'),
    limit(POSTS_PER_FETCH)
  );

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      post_id: doc.id,
      author_avatar: data.author_avatar,
      author_id: data.author_id,
      author_username: data.author_username,
      content: data.content,
      cover_image: data.cover_image,
      created_at: data.created_at.toDate(),
      tags: data.tags,
      title: data.title,
      title_for_search: data.title_for_search,
    } as TPost;
  });

  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { posts, lastVisible };
};

export const useAllPostsInfiniteQuery = () => {
  return useInfiniteQuery<QueryResult, Error, InfiniteData<QueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
    queryKey: ['all-posts'],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null
  });
};

export default useAllPostsInfiniteQuery;