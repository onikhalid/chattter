// api.ts
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, onSnapshot, QueryDocumentSnapshot, DocumentData, getDocs, where } from "firebase/firestore";
import { TPost } from '../types';

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

  let orderByField: string;
  let orderDirection: 'asc' | 'desc';

  switch (sortBy) {
    case 'date_asc':
      orderByField = 'created_at';
      orderDirection = 'asc';
      break;
    case 'alpha_asc':
      orderByField = 'title';
      orderDirection = 'asc';
      break;
    case 'alpha_desc':
      orderByField = 'title';
      orderDirection = 'desc';
      break;
    case 'likes_desc':
      orderByField = 'likes_count';
      orderDirection = 'desc';
      break;
    case 'likes_asc':
      orderByField = 'likes_count';
      orderDirection = 'asc';
      break;
    default:
      orderByField = 'created_at';
      orderDirection = 'desc';
  }

  let q = query(
    postsCollectionRef,
    where("tags_lower", "array-contains", tag_name),
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
  const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { posts, lastVisible };
};

const usePostsByTagInfiniteQuery = (tag_name: string, sortBy: SortOption) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery<QueryResult, Error, InfiniteData<QueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
    queryKey: ['posts-by-tag', { tag_name, sortBy }],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null
  });
};

export default usePostsByTagInfiniteQuery;