"use client"

import { ReactNode } from 'react';
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { createContext } from 'react';
import { User } from 'firebase/auth';

import { auth, db } from '@/utils/firebaseConfig';
import { TBookmark, TPost } from '@/app/(main)/(authenticated-user)/misc/types';
import { TNotification } from '@/app/(main)/(authenticated-user)/misc/types/notification';


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
    isUserDataLoading: boolean;
    userFollows: string[]
    userFollowsProfiles: TUser[]
    userFollowers: string[]
    userFollowersProfils: TUser[]
    userBookmarks: TBookmark[]
    userPosts: TPost[]
    userInterests: string[]
    userNotifications: TNotification[]
};
const initialUserContext: UserInfoContextType = {
    authenticatedUser: {} as User,
    userData: {} as TUser | null | undefined,
    loadingauthenticatedUser: false,
    isUserDataLoading: true,
    userFollows: [],
    userFollowsProfiles: [],
    userFollowers: [],
    userFollowersProfils: [],
    userBookmarks: [],
    userPosts: [],
    userInterests: [],
    userNotifications: []
};



export const UserContext = createContext<UserInfoContextType>(initialUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [isUserDataLoading, setIsUserDataLoading] = useState(true);
    const [authenticatedUser, loadingauthenticatedUser] = useAuthState(auth);
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [userFollowers, setUserFollowers] = useState<string[]>([])
    const [userFollowersProfils, setUserFollowersProfils] = useState<TUser[]>([])
    const [userFollows, setUserFollows] = useState<string[]>([])
    const [userFollowsProfiles, setUserFollowsProfiles] = useState<TUser[]>([])
    const [userBookmarks, setUserBookmarks] = useState<TBookmark[]>([])
    const [userPosts, setUserPosts] = useState<TPost[]>([])
    const [userInterests, setUserInterests] = useState<string[]>([])
    const [userNotifications, setUserNotifications] = useState<TNotification[]>([]);


    useEffect(() => {
        try {
            if (authenticatedUser) {
                const userDocRef = doc(db, `users/${authenticatedUser.uid}`);
                const followsCollectionRef = collection(db, 'follows');
                const bookmarksCollectionRef = collection(db, 'bookmarks');
                const postsCollectionRef = collection(db, 'posts');



                const unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
                    const userData = snapshot.data() as TUser;
                    setUserData(userData);
                    setUserInterests(userData?.interests || []);
                });

                const unsubscribeFollows = onSnapshot(
                    query(followsCollectionRef, where('follower_id', '==', authenticatedUser.uid)),
                    (snapshot) => {
                        const followedUserIds = snapshot.docs.map((doc) => doc.data().followed_id);
                        const followedUsers = snapshot.docs.map((doc) => doc.data());
                        setUserFollowsProfiles(followedUsers as TUser[]);
                        setUserFollows(followedUserIds);
                    },
                    (error) => {
                        console.error("Error fetching follows:", error);
                    }
                );

                const unsubscribePosts = onSnapshot(
                    query(postsCollectionRef, where('author_id', '==', authenticatedUser.uid)),
                    (snapshot) => {
                        const posts = snapshot.docs.map((doc) => doc.data() as TPost);
                        setUserPosts(posts);
                    },
                    (error) => {
                        console.error("Error fetching followers:", error);
                    }
                );

                const unsubscribeFollowers = onSnapshot(
                    query(followsCollectionRef, where('followed_id', '==', authenticatedUser.uid)),
                    (snapshot) => {
                        const followerUserIds = snapshot.docs.map((doc) => doc.data().follower_id);
                        setUserFollowersProfils(snapshot.docs.map((doc) => doc.data()) as TUser[]);

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

                const unsubscribeNotifications = onSnapshot(
                    query(collection(db, 'notifications'), where('receiver_id', '==', authenticatedUser.uid), orderBy('created_at', 'desc')),
                    (snapshot) => {
                        const notifications = snapshot.docs.map((doc) => doc.data() as TNotification);
                        setUserNotifications(notifications);
                    },
                    (error) => {
                        console.error("Error fetching notifications:", error);
                    }
                );

                return () => {
                    unsubscribeUserData();
                    unsubscribeFollows();
                    unsubscribeFollowers();
                    unsubscribeBookmarks();
                    unsubscribePosts();
                    unsubscribeNotifications();
                };
            } else {
                setUserData(null);
                setUserFollows([]);
                setUserFollowers([]);
                setUserBookmarks([]);
                setUserInterests([]);
                setUserPosts([]);
                setUserNotifications([]);
            }
        } catch (error) {

        }
  
        setIsUserDataLoading(false);
    }, [authenticatedUser]);

    return (
        <UserContext.Provider value={{ userData, authenticatedUser, userFollows, userFollowers, userFollowersProfils, userFollowsProfiles,  userPosts, userBookmarks, userInterests, userNotifications, loadingauthenticatedUser, isUserDataLoading }}>
            {children}
        </UserContext.Provider>
    );
};