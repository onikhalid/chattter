export interface TUserChatSession {
    chat_id: string;
    user_id: string;
    last_message_timestamp: string;
    last_message: string;
    unread_count: number;
    receiver_id: string;
    receiver_avatar: string;
    receiver_name: string;
}


export interface TMessage {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
    image_url?: string;
    timestamp: any; 
    is_read: boolean;
}
