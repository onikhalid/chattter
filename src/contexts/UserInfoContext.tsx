"use client"

import { ReactNode } from 'react';
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, DocumentData, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";

import { createContext } from 'react';
import { auth, db } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';
import { TBookmark } from '@/app/(main)/(authenticated-user)/misc/types';


export interface TUser {
    uid: string;
    name: string;
    name_for_search: string[];
    username: string;
    email: string;
    avatar: string;
    bio: string;
    followers: string[];
    followings: string[];
    created_at: Timestamp;
    updated_at: Timestamp;
    interests: string[];
    likes: string[];
    twitter: string;
    instagram: string;
    facebook: string;
    website: string;
    linkedin: string;
}


type UserInfoContextType = {
    authenticatedUser: User | null | undefined,
    userData: TUser | null | undefined;
    loadingauthenticatedUser: boolean;
    userFollows: string[]
    userFollowers: string[]
    userBookmarks: TBookmark[]
    userInterests: string[]
};
const initialUserContext: UserInfoContextType = {
    authenticatedUser: {} as User,
    userData: {} as TUser | null | undefined,
    loadingauthenticatedUser: false,
    userFollows: [],
    userFollowers: [],
    userBookmarks: [],
    userInterests: [],
};



export const UserContext = createContext<UserInfoContextType>(initialUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [authenticatedUser, loadingauthenticatedUser] = useAuthState(auth);
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [userFollowers, setUserFollowers] = useState<string[]>([])
    const [userFollows, setUserFollows] = useState<string[]>([])
    const [userBookmarks, setUserBookmarks] = useState<TBookmark[]>([])
    const [userInterests, setUserInterests] = useState<string[]>([])


    useEffect(() => {
        if (authenticatedUser) {
            const userDocRef = doc(db, `users/${authenticatedUser.uid}`);
            const followsCollectionRef = collection(db, 'follows');
            const bookmarksCollectionRef = collection(db, 'bookmarks');

            const unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
                const userData = snapshot.data() as TUser;
                setUserData(userData);
                setUserInterests(userData?.interests || []);
            });

            const unsubscribeFollows = onSnapshot(
                query(followsCollectionRef, where('follower_id', '==', authenticatedUser.uid)),
                (snapshot) => {
                    const followedUserIds = snapshot.docs.map((doc) => doc.data().followed_id);
                    setUserFollows(followedUserIds);
                },
                (error) => {
                    console.error("Error fetching follows:", error);
                }
            );

            const unsubscribeFollowers = onSnapshot(
                query(followsCollectionRef, where('followed_id', '==', authenticatedUser.uid)),
                (snapshot) => {
                    const followerUserIds = snapshot.docs.map((doc) => doc.data().follower_id);
                    setUserFollowers(followerUserIds);
                },
                (error) => {
                    console.error("Error fetching followers:", error);
                }
            );

            const unsubscribeBookmarks = onSnapshot(
                query(bookmarksCollectionRef, where('bookmarker_id', '==', authenticatedUser.uid)),
                (snapshot) => {
                    const userBookmarkIds = snapshot.docs.map((doc) => doc.data() as TBookmark);
                    setUserBookmarks(userBookmarkIds);
                },
                (error) => {
                    console.error("Error fetching bookmarks:", error);
                }
            );

            return () => {
                unsubscribeUserData();
                unsubscribeFollows();
                unsubscribeFollowers();
                unsubscribeBookmarks();
            };
        } else {
            setUserData(null);
            setUserFollows([]);
            setUserFollowers([]);
            setUserBookmarks([]);
            setUserInterests([]);
        }
    }, [authenticatedUser]);

    return (
        <UserContext.Provider value={{ userData, authenticatedUser, userFollows, userFollowers, userBookmarks, userInterests, loadingauthenticatedUser }}>
            {children}
        </UserContext.Provider>
    );
};