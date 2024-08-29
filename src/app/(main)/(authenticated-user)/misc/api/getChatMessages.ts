import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from "@/utils/firebaseConfig";
import { collection, query, orderBy, onSnapshot, DocumentData, doc, getDocs } from "firebase/firestore";
import { TMessage } from '../types/chats';
import React from 'react';


const getMessagesInChat = async (chat_id: string): Promise<TMessage[]> => {
    const chatRef = doc(db, 'chats', chat_id);
    const messagesCollectionRef = collection(chatRef, 'messages');
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as TMessage);
};

export const useMessagesInChat = (chat_id: string) => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const chatRef = doc(db, 'chats', chat_id);
        const messagesCollectionRef = collection(chatRef, 'messages');
        const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages: TMessage[] = snapshot.docs.map((doc) => doc.data() as TMessage);
            queryClient.setQueryData(['messages-in-chat', chat_id], messages);
        });

        return () => unsubscribe();
    }, [chat_id, queryClient]);

    return useQuery<TMessage[], Error>({
        queryKey: ['messages-in-chat', chat_id],
        queryFn: () => getMessagesInChat(chat_id),
        staleTime: 0, // Allow refetching
    });
};