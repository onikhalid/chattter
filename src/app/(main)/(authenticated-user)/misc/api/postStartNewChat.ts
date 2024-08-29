import { db } from "@/utils/firebaseConfig";
import { doc, collection, serverTimestamp, writeBatch, getDocs, query, where } from "firebase/firestore";
import { useMutation } from "@tanstack/react-query";

interface StartChatParams {
    sender_details: {
        name: string;
        avatar: string;
        id: string;
    },
    receiver_details: {
        name: string;
        avatar: string;
        id: string;
    }
}

export const startNewChat = async ({ sender_details, receiver_details }: StartChatParams) => {
    const chatId1 = `${sender_details.id}_${receiver_details.id}`;
    const chatId2 = `${receiver_details.id}_${sender_details.id}`;

    const userChatsCollectionRef = collection(db, 'user_chats');
    const chatQuery1 = query(userChatsCollectionRef, where('chat_id', '==', chatId1));
    const chatQuery2 = query(userChatsCollectionRef, where('chat_id', '==', chatId2));
    
    const [chatDocs1, chatDocs2] = await Promise.all([
        getDocs(chatQuery1),
        getDocs(chatQuery2),
    ]);

    if (!chatDocs1.empty) {
        console.log('Chat session already exists:', chatId1);
        return chatId1;
    } else if (!chatDocs2.empty) {
        console.log('Chat session already exists:', chatId2);
        return chatId2;
    }

    const batch = writeBatch(db);

    const senderChatSessionRef = doc(userChatsCollectionRef, `${sender_details.id}_${chatId1}`);
    const receiverChatSessionRef = doc(userChatsCollectionRef, `${receiver_details.id}_${chatId1}`);

    batch.set(senderChatSessionRef, {
        chat_id: chatId1,
        user_id: sender_details.id,
        receiver_id: receiver_details.id,
        receiver_avatar: receiver_details.avatar,
        receiver_name: receiver_details.name,
        last_message_timestamp: serverTimestamp(),
        unread_count: 0,
    });

    batch.set(receiverChatSessionRef, {
        chat_id: chatId1,
        user_id: receiver_details.id,
        receiver_id: sender_details.id,
        receiver_avatar: sender_details.avatar,
        receiver_name: sender_details.name,
        last_message_timestamp: null,
        unread_count: 0,
    });

    await batch.commit();
    return chatId1;
};

export const useStartChat = () => {
    return useMutation({
        mutationFn: startNewChat,
    });
};

