"use client"

import { ReactNode } from 'react';
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, DocumentData, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { createContext } from 'react';
import { auth, db } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';


interface TUser {
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

    useLayoutEffect(() => {
        const getUserData = async () => {
            if (!loadingauthenticatedUser) {
                if (authenticatedUser) {
                    const userDocRef = doc(db, `users/${authenticatedUser.uid}`)
                    const postsCollectionRef = collection(db, "posts");
                    const followsCollectionRef = collection(db, 'follows');
                    const bookmarksCollectionRef = collection(db, 'bookmarks');

                    try {
                        onSnapshot(userDocRef, (snapshot) => {
                            setUserData(snapshot.data() as TUser || {})
                            setUserInterests(snapshot.data()?.interests || [])
                        })

                        const followedUsersQuerySnapshot = await getDocs(query(followsCollectionRef, where('follower_id', '==', authenticatedUser.uid)));
                        const followedUserIds = followedUsersQuerySnapshot.docs.map((doc) => doc.data().following_id);
                        setUserFollows(followedUserIds)


                        const bookmarksQuerySnapshot = await getDocs(query(bookmarksCollectionRef, where('bookmarker_id', '==', authenticatedUser.uid)));
                        const userBookmarkIds = bookmarksQuerySnapshot.docs.map((doc) => doc.data().post_id);
                        setUserBookmarks(userBookmarkIds);
                    }
                    catch (error: any) {
                        if (error.code === "failed-precondition") {
                            toast.error("Poor internet connection")
                        }
                        else if (error.code === "auth/network-request-failed" || "unavailable") {
                            toast.error("There appears to be a problem with your connection", {
                                position: "top-center"
                            })
                        }
                        else if (error.message.includes("Backend didn't respond" || "[code=unavailable]")) {
                            toast.error("There appears to be a problem with your connection", {
                                position: "top-center"
                            })
                        }
                    }
                }
                else {
                    setUserData(null)
                }
            }
        }



        getUserData()
        return () => { };
    }, [authenticatedUser, loadingauthenticatedUser]);






    return (
        <UserContext.Provider value={{ userData, authenticatedUser, userFollows, userBookmarks, userInterests, loadingauthenticatedUser }}>
            {children}
        </UserContext.Provider>
    );
};



