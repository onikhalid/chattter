"use client"

import { ReactNode } from 'react';
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, DocumentData, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { createContext } from 'react';
import { auth, db } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';


export interface TUser {
    uid: string;
    name: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    followers: string[];
    followings: string[];
    created_at: Date;
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
    userBookmarks: string[]
    userInterests: string[]
};
const initialUserContext: UserInfoContextType = {
    authenticatedUser: {} as User,
    userData: {} as TUser | null | undefined,
    loadingauthenticatedUser: false,
    userFollows: [],
    userBookmarks: [],
    userInterests: [],
};



export const UserContext = createContext<UserInfoContextType>(initialUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [authenticatedUser, loadingauthenticatedUser] = useAuthState(auth);
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [userFollowers, setUserFollowers] = useState<string[]>([])
    const [userFollows, setUserFollows] = useState<string[]>([])
    const [userBookmarks, setUserBookmarks] = useState<string[]>([])
    const [userInterests, setUserInterests] = useState<string[]>([])


    useEffect(() => {
        if (authenticatedUser) {
            const userDocRef = doc(db, `users/${authenticatedUser.uid}`);
            const followsCollectionRef = collection(db, 'follows');
            const bookmarksCollectionRef = collection(db, 'bookmarks');

            // Real-time listener for user data
            const unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
                const userData = snapshot.data() as TUser;
                setUserData(userData);
                setUserInterests(userData.interests || []);
            });

            // Real-time listener for follows
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

            // Real-time listener for bookmarks
            const unsubscribeBookmarks = onSnapshot(
                query(bookmarksCollectionRef, where('bookmarker_id', '==', authenticatedUser.uid)),
                (snapshot) => {
                    const userBookmarkIds = snapshot.docs.map((doc) => doc.data().post_id);
                    setUserBookmarks(userBookmarkIds);
                },
                (error) => {
                    console.error("Error fetching bookmarks:", error);
                }
            );

            return () => {
                unsubscribeUserData();
                unsubscribeFollows();
                unsubscribeBookmarks();
            };
        } else {
            setUserData(null);
            setUserFollows([]);
            setUserBookmarks([]);
            setUserInterests([]);
        }
    }, [authenticatedUser]);

    return (
        <UserContext.Provider value={{ userData, authenticatedUser, userFollows, userBookmarks, userInterests, loadingauthenticatedUser }}>
            {children}
        </UserContext.Provider>
    );
};