import { useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { UserContext } from '@/contexts';
import { TUserChatSession } from '../types/chats';

const getUserChatSessions = (userId: string) => {
    return new Promise<TUserChatSession[]>((resolve, reject) => {
        const userChatsCollectionRef = collection(db, 'user_chats');
        const userChatsQuery = query(
            userChatsCollectionRef,
            where('user_id', '==', userId),
            orderBy('last_message_timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(userChatsQuery,
            (snapshot) => {
                const chatData: TUserChatSession[] = snapshot.docs.map((doc) => doc.data() as TUserChatSession);
                resolve(chatData);
            },
            (error) => {
                reject(error);
            }
        );

        return unsubscribe;
    });
};

const useUserChatSessions = () => {
    const queryClient = useQueryClient();
    const { userData, loadingauthenticatedUser } = useContext(UserContext);
    const queryKey = ['user-chat-sessions', userData?.uid];

    return useQuery({
        queryKey,
        queryFn: () => getUserChatSessions(userData?.uid || ''),
        enabled: !loadingauthenticatedUser && !!userData,
    });
};

export default useUserChatSessions;