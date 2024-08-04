"use client"

import { ReactNode } from 'react';
import { useState, useEffect, useLayoutEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";

import { createContext } from 'react';
import { auth, db } from '@/utils/firebaseConfig';
import { User } from 'firebase/auth';


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
    setUserData?: React.Dispatch<React.SetStateAction<DocumentData | null | undefined>>;
};
const initialUserContext: UserInfoContextType = {
    authenticatedUser: {} as User,
    userData: {} as DocumentData | null | undefined,
    setUserData: () => { },
    loadingauthenticatedUser: false,
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

    
    useLayoutEffect(() => {
        const getUserData = async () => {
            if (!loadingauthenticatedUser) {
                if (authenticatedUser) {
                    const userDocRef = doc(db, `users/${authenticatedUser.uid}`)
                    onSnapshot(userDocRef, (snapshot) => {
                        setUserData(snapshot.data() || {})
                    })
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
        <UserContext.Provider value={{ userData, setUserData, authenticatedUser, loadingauthenticatedUser }}>
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