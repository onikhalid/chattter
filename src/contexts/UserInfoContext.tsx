"use client"

import { ReactNode } from 'react';
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, DocumentData, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { createContext } from 'react';
import { auth, db } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';


export const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
});


export const MobileNavContext = createContext({
    hidden: true,
    toggleTheme: () => { },
});

type UserInfoContextType = {
    authenticatedUser: User | null | undefined,
    userData: DocumentData | null | undefined;
    loadingauthenticatedUser: boolean;
    // setUserData?: React.Dispatch<React.SetStateAction<DocumentData | null | undefined>>;
    userFollowers: string[]
    userBookmarks: string[]
};
const initialUserContext: UserInfoContextType = {
    authenticatedUser: {} as User,
    userData: {} as DocumentData | null | undefined,
    // setUserData: () => { },
    loadingauthenticatedUser: false,
    userFollowers: [],
    userBookmarks: []
};
export const UserContext = createContext<UserInfoContextType>(initialUserContext);


export const ThreadContext = createContext({
    threadId: null,
    setThreadId: () => { },
    threadPost: {},
    setThreadPost: {},
});




export const ThemeProvider = ({ children }: { children: ReactNode }) => {

    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((theme) => theme === 'dark' ? 'light' : 'dark');
    };

    useLayoutEffect(() => {
        if (localStorage.getItem("theme") === null) {
            setTheme('light')
        } else {
            const currentTheme = localStorage.getItem('theme') || 'light';
            setTheme(currentTheme);
        }

    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};









export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [authenticatedUser, loadingauthenticatedUser] = useAuthState(auth);
    const [userData, setUserData] = useState<DocumentData | undefined | null>({});
    const [userFollowers, setUserFollowers] = useState<string[]>([])
    const [userFollowings, setUserFollowings] = useState<string[]>([])
    const [userBookmarks, setUserBookmarks] = useState<string[]>([])


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
                            setUserData(snapshot.data() || {})
                        })

                        const followedUsersQuerySnapshot = await getDocs(query(followsCollectionRef, where('follower_id', '==', authenticatedUser.uid)));
                        const followedUserIds = followedUsersQuerySnapshot.docs.map((doc) => doc.data().following_id);
                        setUserFollowings(followedUserIds)


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
        <UserContext.Provider value={{ userData, authenticatedUser, loadingauthenticatedUser, userFollowers, userBookmarks }}>
            {children}
        </UserContext.Provider>
    );
};





// export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
//     const [thread, setThreadId] = useState<string | null>(null);
//     const [threadParent, setThreadParent] = useState(null);

//     const setThread = (newThreadId: string) => {
//         setThreadId(newThreadId);
//     };



//     return (
//         <ThreadContext.Provider value={{ thread, setThread, threadParent, setThreadParent }}>
//             {children}
//         </ThreadContext.Provider>
//     );
// };