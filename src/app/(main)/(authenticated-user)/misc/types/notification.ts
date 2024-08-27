export type NotificationType =
    | "NEW_POST"
    | "NEW_FOLLOWER"
    | "POST_LIKED"
    | "POST_SAVED"
    | "POST_COMMENT"
    | "COMMENT_REPLIED";

export interface NotificationDetails {
    post_id?: string;
    post_cover_photo?: string;
    post_title?: string;
    post_author_avatar?: string;
    post_author_name?: string;
    post_author_username?: string;
    comment_id?: string;
    comment_content?: string;
    commentor_avatar?: string;
    commentor_name?: string;
    commentor_username?: string;
    
}
export interface UserDetails {
    user_id: string;
    user_name: string;
    user_avatar: string;
    user_username: string
}

export interface TNotification {
    receiver_id: string;
    sender_id: string;
    read_status: boolean;
    sender_details: UserDetails;
    receiver_details: UserDetails;
    notification_type: NotificationType;
    notification_details: NotificationDetails;
    created_at: Date;
    notification_id: string;
}

export interface CreateNotificationInput {
    receiver_id: string;
    sender_id: string;
    notification_type: NotificationType;
    sender_details: UserDetails;
    receiver_details: UserDetails;
    notification_details: NotificationDetails;
    created_at?: Date;
    notification_id?: string;
}
