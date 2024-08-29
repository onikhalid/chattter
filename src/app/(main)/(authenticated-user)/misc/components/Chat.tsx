import React, { useState, useEffect, useRef, ChangeEvent, FormEvent, useContext } from 'react';
import { doc,  Timestamp, updateDoc } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

import { Button, Input } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '@/contexts';
import { cn } from '@/utils/classNames';
import { db } from '@/utils/firebaseConfig';


import { useCreateNotification, useMessagesInChat } from '../api';
import { useSendMessage } from '../api';
import { TMessage } from '../types/chats';


interface Props {
    chat_id: string;
    current_user_id: string;
    receiver_id: string;
    unread_count: number
}

const Chat: React.FC<Props> = ({ chat_id, current_user_id, receiver_id, unread_count }) => {
    const { data: messages, isLoading } = useMessagesInChat(chat_id);
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { mutate: sendMessage } = useSendMessage();
    const { mutate: sendNotification } = useCreateNotification()
    const queryClient = useQueryClient();
    const { userData } = useContext(UserContext)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const resetUnreadMessageCount = async () => {
            if(unread_count == 0) {
                return;
            }
            try {
                const chatDocRef = doc(db, 'user_chats', `${current_user_id}_${chat_id}`);
                await updateDoc(chatDocRef, {
                    unread_count: 0,
                });
                console.log('Unread message count reset to zero');
            } catch (error) {
                console.error('Error resetting unread message count:', error);
            }
        };

        resetUnreadMessageCount();
    }, [chat_id, unread_count]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const newMessageObj = {
                chat_id,
                sender_id: current_user_id,
                receiver_id: receiver_id,
                text: newMessage,
                timeStamp: Timestamp.fromDate(new Date()),
            };

            queryClient.setQueryData(['messages-in-chat', chat_id], (old: TMessage[] | undefined) => {
                const optimisticMessage: TMessage = {
                    ...newMessageObj,
                    message_id: Date.now().toString(),
                    timestamp: Timestamp.fromDate(new Date()),
                    is_read: false,
                };
                return [...(old || []), optimisticMessage];
            });

            sendMessage(newMessageObj, {
                onSuccess() {
                    sendNotification({
                        receiver_id: receiver_id,
                        receiver_details: {
                            user_id: receiver_id,
                            user_name: 'Chattter App',
                            user_avatar: '',
                            user_username: 'chatt'
                        },
                        sender_id: current_user_id,
                        sender_details: {
                            user_id: current_user_id,
                            user_name: userData?.name || 'Chattter App',
                            user_avatar: userData?.avatar || '',
                            user_username: userData?.username || 'chatt'
                        },
                        notification_type: "CHAT_SENT",
                        notification_details: {
                            chat_id: chat_id
                        }
                    })
                },
                onError: (error) => {
                    console.error("Failed to send message:", error);
                    queryClient.invalidateQueries({ queryKey: ['messages-in-chat', chat_id] });
                },
            });

            setNewMessage('');
        }
    };

    if (isLoading) {
        return <div className="size-full flex items-center justify-center text-center py-4">Loading messages...</div>;
    }

    return (
        <div className="grid grid-rows-[1fr,max-content] h-full max-h-full border rounded-none bg-background">
            <div className="p-4 size-full overflow-y-scroll">
                {
                    messages?.map((message) => (
                        <div
                            key={message.message_id}
                            className={`flex flex-col mb-2 p-2 rounded-lg max-w-xs break-words ${message.sender_id === current_user_id
                                ? 'bg-primary text-primary-foreground ml-auto text-sm pl-3'
                                : 'bg-secondary text-secondary-foreground'
                                }`}
                        >
                            {message.text}
                            <p className={cn('ml-auto !text-xs text-muted-foreground italic pt-2', message.sender_id === current_user_id && "text-background ")}>
                                {format(new Date(!!message.timestamp ? message.timestamp.toDate() : new Date()), 'hh:mm a')}
                            </p>
                        </div>
                    ))
                }
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex border-t border-muted w-full">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 border-none p-2 rounded-l-lg focus:outline-none grow"
                    containerClassName='grow'
                />
                <Button
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-white p-2 px-4 rounded-r-lg   text-sm !h-full"
                    disabled={newMessage.trim() == ""}
                >
                    Send
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
};

export default Chat;