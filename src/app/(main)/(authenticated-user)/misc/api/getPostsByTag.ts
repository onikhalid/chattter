import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, onSnapshot, QueryDocumentSnapshot, DocumentData, getDocs, where } from "firebase/firestore";
import { TPost } from '../types';
import { getOrderFieldAndDirection } from '../utils';

const POSTS_PER_FETCH = 10;

export interface QueryResult {
  posts: TPost[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type SortOption = 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc' | 'likes_desc' | 'likes_asc';

type QueryKey = ['posts-by-tag', { tag_name: string, sortBy: SortOption }];

const getPosts = async ({ pageParam = null, queryKey }: QueryFunctionContext<QueryKey, QueryDocumentSnapshot<DocumentData> | null>): Promise<QueryResult> => {
  const [, { tag_name, sortBy }] = queryKey;
  const postsCollectionRef = collection(db, "posts");
  const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);



  let q = query(
    postsCollectionRef,
    where("tags_lower", "array-contains", tag_name),
    // orderBy("created_at", 'desc'),
    orderBy(orderByField, orderDirection),
    limit(POSTS_PER_FETCH)
  );

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const snapshot = await getDocs(q);

  const posts = snapshot.docs.map(doc => {
    return doc.data() as TPost;

  });


  if (sortBy === 'likes_asc') {
    posts.sort((a, b) => b.likes.length - a.likes.length);
  } else if (sortBy === 'likes_desc') {
    posts.sort((a, b) => a.likes.length - b.likes.length);
  }

  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { posts, lastVisible };
};




const usePostsByTagInfiniteQuery = (tag_name: string, sortBy: SortOption) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);
    const postsCollectionRef = collection(db, "posts");
    const q = query(
      postsCollectionRef,
      orderBy(orderByField, orderDirection),
      limit(POSTS_PER_FETCH)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => {
        return { ...doc.data() } as TPost;
      });

      const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      queryClient.setQueryData<InfiniteData<QueryResult>>(['posts-by-tag'], (oldData) => {
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
  }, [queryClient, sortBy]);

  return useInfiniteQuery<QueryResult, Error, InfiniteData<QueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
    queryKey: ['posts-by-tag', { tag_name, sortBy }],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null
  });
};

export default usePostsByTagInfiniteQuery;
