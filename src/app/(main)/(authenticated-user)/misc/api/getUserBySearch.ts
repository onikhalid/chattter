import { useEffect } from 'react';
import { useInfiniteQuery, useQueryClient, QueryFunctionContext, InfiniteData } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, limit, startAfter, onSnapshot, QueryDocumentSnapshot, DocumentData, getDocs, where, or } from "firebase/firestore";
import { getOrderFieldAndDirection } from '../utils';
import { TUser } from '@/contexts';

const USERS_PER_FETCH = 25;

export interface UsersQueryResult {
    users: TUser[];
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type SortOption = 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc' | 'likes_desc' | 'likes_asc';

type QueryKey = ['users-by-search', { search_text: string, sortBy: SortOption }];

const getUsers = async ({ pageParam = null, queryKey }: QueryFunctionContext<QueryKey, QueryDocumentSnapshot<DocumentData> | null>): Promise<UsersQueryResult> => {
    const [, { search_text, sortBy }] = queryKey;
    if (!search_text.trim()) {
        return { users: [], lastVisible: null };
    }


    const usersCollectionRef = collection(db, "users");
    const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);
    const searchWords = search_text.toLowerCase().split(/\s+/).filter(word => word.length > 0) || "";
    // Return empty result if search_text is empty

    const conditions = [
        where('name_for_search', 'array-contains-any', [
            search_text.toLowerCase(),
            search_text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
            ...searchWords,
        ]),
        where('name', '==', search_text),
        where('username', '==', search_text)
    ];


    let q = query(usersCollectionRef, or(...conditions), orderBy(orderByField, orderDirection),
        limit(USERS_PER_FETCH));

    if (pageParam) {
        q = query(q, startAfter(pageParam));
    }

    const snapshot = await getDocs(q);

    const users = snapshot.docs.map(doc => {
        return doc.data() as TUser;

    });

    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { users, lastVisible };
};




const useUsersBySearchInfiniteQuery = (search_text: string, sortBy: SortOption) => {
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!search_text.trim()) return;

        const { orderByField, orderDirection } = getOrderFieldAndDirection(sortBy);
        const usersCollectionRef = collection(db, "users");

        const searchWords = search_text.toLowerCase().split(/\s+/).filter(word => word.length > 0) || "";

        const conditions = [
            where('name_for_search', 'array-contains-any', [
                search_text.toLowerCase(),
                search_text.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
                ...searchWords,
            ]),
            where('name', '==', search_text),
            where('username', '==', search_text)
        ];

        let q = query(usersCollectionRef, or(...conditions), orderBy(orderByField, orderDirection),
            limit(USERS_PER_FETCH));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => {
                return { ...doc.data() } as TUser;
            });

            const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

            queryClient.setQueryData<InfiniteData<UsersQueryResult>>(['users-by-search'], (oldData) => {
                if (!oldData) {
                    return {
                        pageParams: [null],
                        pages: [{ users, lastVisible }]
                    };
                }

                return {
                    ...oldData,
                    pages: [{ users, lastVisible }]
                };
            });
        });

        return () => unsubscribe();
    }, [queryClient, sortBy, search_text]);

    return useInfiniteQuery<UsersQueryResult, Error, InfiniteData<UsersQueryResult>, QueryKey, QueryDocumentSnapshot<DocumentData> | null>({
        queryKey: ['users-by-search', { search_text, sortBy }],
        queryFn: getUsers,
        getNextPageParam: (lastPage) => lastPage.lastVisible,
        initialPageParam: null,
        enabled: search_text.trim() !== ""
    });
};

export default useUsersBySearchInfiniteQuery;
