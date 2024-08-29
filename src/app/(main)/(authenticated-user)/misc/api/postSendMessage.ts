import { db } from "@/utils/firebaseConfig";
import { useMutation } from "@tanstack/react-query";
import { doc, collection, addDoc, updateDoc, serverTimestamp, increment, runTransaction } from "firebase/firestore";

interface SendMessageParams {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    text?: string;
    image_url?: string;
}

export const sendMessage = async ({ chat_id, sender_id, receiver_id, text, image_url }: SendMessageParams) => {
    const chatRef = doc(db, 'chats', chat_id);
    const messagesCollectionRef = collection(chatRef, 'messages');
    const senderUserChatRef = doc(db, 'user_chats', `${sender_id}_${chat_id}`);
    const receiverUserChatRef = doc(db, 'user_chats', `${receiver_id}_${chat_id}`);

    await runTransaction(db, async (transaction) => {
        // Create the message document
        const newMessage = {
            sender_id,
            receiver_id,
            text: text || "",
            image_url: image_url || "",
            timestamp: serverTimestamp(),
            is_read: false,
        };

        const messageDocRef = await addDoc(messagesCollectionRef, newMessage);

        transaction.update(messageDocRef, {
            message_id: messageDocRef.id,
        });
    
        // Update the sender's user_chat document
        transaction.update(senderUserChatRef, {
            last_message_timestamp: serverTimestamp(),
        });

        // Update the receiver's user_chat document, incrementing unread_count
        transaction.update(receiverUserChatRef, {
            last_message_timestamp: serverTimestamp(),
            unread_count: increment(1),
        });

        return messageDocRef.id;
    });
};


export const useSendMessage = () => {
    return useMutation({
        mutationFn: sendMessage
    })
}