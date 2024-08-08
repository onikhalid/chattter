import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, onSnapshot, QueryDocumentSnapshot, DocumentData, getDocs, where } from "firebase/firestore";
import { TPost } from '../types';

const POSTS_PER_FETCH = 10;

export interface QueryResult {
  posts: TPost[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type QueryKey = ['all-follows-posts', { follows: string[] }];

const getPosts = async ({ pageParam = null, queryKey }: QueryFunctionContext<QueryKey, QueryDocumentSnapshot<DocumentData> | null>): Promise<QueryResult> => {
  const [, { follows }] = queryKey; 
  const postsCollectionRef = collection(db, "posts");
  let q = query(
    postsCollectionRef,
    where("author_id", "in", follows),
    orderBy("created_at", 'desc'),
    limit(POSTS_PER_FETCH)
  );

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const snapshot = await getDocs(q);

  const posts = snapshot.docs.map(doc => {
    return doc.data() as TPost;

  });

  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { posts, lastVisible };
};

const useFollowsPostsInfiniteQuery = (follows: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const q = query(
      postsCollectionRef,
      orderBy("created_at", 'desc'),
      limit(POSTS_PER_FETCH)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => {
        return { ...doc.data() } as TPost;
      });

      const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      queryClient.setQueryData<InfiniteData<QueryResult>>(['all-posts'], (oldData) => {
        if (!oldData) {
          return {
            pageParams: [null],
            pages: [{ posts, lastVisible }]
          };
        }

        return {
          ...oldData,
          pages: [{ posts, lastVisible }]
        };
      });
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useInfiniteQuery<QueryResult, Error, InfiniteData<QueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
    queryKey: ['all-follows-posts', { follows }],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null
  });
};

export default useFollowsPostsInfiniteQuery;
