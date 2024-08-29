import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, onSnapshot, QueryDocumentSnapshot, DocumentData, getDocs, where, or } from "firebase/firestore";
import { TPost } from '../types';
import { getOrderFieldAndDirection } from '../utils';
import { capitalizeFirstLetter } from '@/utils/strings';

const POSTS_PER_FETCH = 15;

export interface QueryResult {
    posts: TPost[];
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type SortOption = 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc' | 'likes_desc' | 'likes_asc';

type QueryKey = ['posts-by-search', { search_text: string, sortBy: SortOption }];

const getPosts = async ({ pageParam = null, queryKey }: QueryFunctionContext<QueryKey, QueryDocumentSnapshot<DocumentData> | null>): Promise<QueryResult> => {
    const [, { search_text, sortBy }] = queryKey;

    if (!search_text.trim()) {
        return { posts: [], lastVisible: null };
    }

    const postsCollectionRef = collection(db, "posts");
    const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);

    const searchWords = search_text.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    const conditions = [
        where('title_for_search', 'array-contains-any', [
            search_text.toLowerCase(),
            search_text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
            ...searchWords, 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
        ]),
        where('tags_lower', 'array-contains-any', searchWords),
        where('author_name', '==', search_text),
        where('author_username', '==', search_text)
    ];

    let q = query(postsCollectionRef, or(...conditions), orderBy(orderByField, orderDirection),
        limit(POSTS_PER_FETCH));

    if (pageParam) {
        q = query(q, startAfter(pageParam));
    }

    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map(doc => doc.data() as TPost);

    if (sortBy === 'likes_asc') {
        posts.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sortBy === 'likes_desc') {
        posts.sort((a, b) => a.likes.length - b.likes.length);
    }

    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { posts, lastVisible };
};

const usePostsBySearchInfiniteQuery = (search_text: string, sortBy: SortOption) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!search_text.trim()) return;

        const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);
        const postsCollectionRef = collection(db, "posts");

        const searchWords = search_text.toLowerCase().split(/\s+/).filter(word => word.length > 0);

        const conditions = [
            where('title_for_search', 'array-contains-any', [
                search_text.toLowerCase(),
                search_text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
                ...searchWords,
            ]),
            where('tags_lower', 'array-contains-any', searchWords),
            where('author_name', '==', search_text),
            where('author_username', '==', search_text)
        ];

        let q = query(postsCollectionRef, or(...conditions), orderBy(orderByField, orderDirection),
            limit(POSTS_PER_FETCH));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => doc.data() as TPost);
            const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

            queryClient.setQueryData<InfiniteData<QueryResult>>(['posts-by-search'], (oldData) => {
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
    }, [queryClient, sortBy, search_text]);

    return useInfiniteQuery<QueryResult, Error, InfiniteData<QueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
        queryKey: ['posts-by-search', { search_text, sortBy }],
        queryFn: getPosts,
        getNextPageParam: (lastPage) => lastPage.lastVisible,
        initialPageParam: null,
        enabled: !!search_text.trim(), // Prevents query from running if search_text is empty
    });
};

export default usePostsBySearchInfiniteQuery;
