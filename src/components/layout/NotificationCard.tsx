import React from 'react'
import { setDoc, doc, collection, deleteDoc } from 'firebase/firestore'
import { ArrowUpRightFromSquare, Bookmark, Circle, Heart, MessageCircle, MessagesSquare, Send, Trash2, TrashIcon, UserPlus } from 'lucide-react'

import { TNotification } from '@/app/(main)/(authenticated-user)/misc/types/notification'
import Link from 'next/link'
import { db } from '@/utils/firebaseConfig'
import { cn } from '@/utils/classNames'

import { Avatar } from '../ui'




const NotificationCard = ({ notification, closeDrawer }: { notification: TNotification, closeDrawer: () => void }) => {
    const { sender_details, notification_type, notification_details } = notification;
    const senderName = sender_details.user_name;
    const senderAvatar = sender_details.user_avatar;

    const getNotificationIcon = () => {
        switch (notification_type) {
            case 'NEW_FOLLOWER':
                return <UserPlus size={30} strokeWidth={1.5} />
            case 'NEW_POST':
                return <Bookmark size={30} strokeWidth={1.5} />
            case 'COMMENT_REPLIED':
                return <MessagesSquare size={30} strokeWidth={1.5} />
            case 'POST_COMMENT':
                return <MessageCircle size={30} strokeWidth={1.5} />
            case 'POST_LIKED':
                return <Heart size={30} strokeWidth={1.5} />
            case 'POST_SAVED':
                return <Bookmark size={30} strokeWidth={1.5} />
            case 'CHAT_SENT':
                return <Send size={30} strokeWidth={1.5} />
            default:
                return <Circle size={30} strokeWidth={1.5} />
        }
    }

    const renderNotificationContent = () => {
        switch (notification_type) {
            case 'NEW_FOLLOWER':
                return (
                    <p>
                        <Link href={`/u/${sender_details.user_username}`} className=''>
                            <Avatar src={senderAvatar} alt={senderName} size='small' fallback={senderName} className='h-5 w-5' />
                            {senderName}
                        </Link> started following you
                    </p>
                );
            case 'NEW_POST':
                return (
                    <div>
                        <Link href={`/u/${sender_details.user_username}`} className='font-display font-semibold'>
                            {senderName}
                        </Link>
                        {" "}created a new post!: {" "}
                        <p className='underline'>
                            <Link href={`/p/${notification_details.post_id}`} className='flex items-center gap-1.5'>
                                {notification_details.post_title}
                                <ArrowUpRightFromSquare size={13} />
                            </Link>
                        </p>
                    </div>
                );
            case 'COMMENT_REPLIED':
                return (
                    <p>
                        <Link href={`/u/${sender_details.user_username}`} className=''>
                            <Avatar src={senderAvatar} alt={senderName} size='small' fallback={senderName} className='h-5 w-5' />
                            {senderName}
                        </Link> replied to your comment:
                        <Link href={`/p/${notification_details.post_id}`}>
                            <>{notification_details.post_title}</>
                        </Link>
                    </p>
                );
            case 'POST_COMMENT':
                return (
                    <div>
                        <Link href={`/u/${sender_details.user_username}`} className='font-display font-semibold'>
                            {senderName}
                        </Link>
                        {" "}commented on your post: {" "}
                        <p className='underline'>
                            <Link href={`/p/${notification_details.post_id}`} className='flex items-center gap-1.5'>
                                {notification_details.post_title}
                                <ArrowUpRightFromSquare size={13} />
                            </Link>
                        </p>
                    </div>
                );
            case 'POST_LIKED':
                return (
                    <div>
                        <Link href={`/u/${sender_details.user_username}`} className='font-display font-semibold'>
                            {senderName}
                        </Link>
                        {" "}liked your post: {" "}
                        <p className='underline'>
                            <Link href={`/p/${notification_details.post_id}`} className='flex items-center gap-1.5'>
                                {notification_details.post_title}
                                <ArrowUpRightFromSquare size={13} />
                            </Link>
                        </p>
                    </div>
                );
            case 'POST_SAVED':
                return (
                    <div>
                        <Link href={`/u/${sender_details.user_username}`} className='font-display font-semibold'>
                            {senderName}
                        </Link>
                        {" "}saved your post: {" "}
                        <p className='underline'>
                            <Link href={`/p/${notification_details.post_id}`} className='flex items-center gap-1.5'>
                                {notification_details.post_title}
                                <ArrowUpRightFromSquare size={13} />
                            </Link>
                        </p>
                    </div>
                );
            case 'CHAT_SENT':
                return (
                    <div>
                        <Link href={`/u/${sender_details.user_username}`} className='font-display font-semibold'>
                            {senderName}
                        </Link>
                        {" "}sent you a message {" "}
                        <p className='underline'>
                            <Link href={`/chats?chat=${notification_details.chat_id}`} className='flex items-center gap-1.5' onClick={closeDrawer}>
                                Chat
                                <ArrowUpRightFromSquare size={13} />
                            </Link>
                        </p>
                    </div>
                );
            default:
                return <span>Notification</span>;
        }
    }


    const deleteNotification = async () => {
        const notificationCollectionRef = collection(db, 'notifications')
        const notificationDocRef = doc(notificationCollectionRef, notification.notification_id)
        await deleteDoc(notificationDocRef)
    }


    const markNotificationAsRead = async () => {
        if (notification.read_status) return
        const notificationCollectionRef = collection(db, 'notifications')
        const notificationDocRef = doc(notificationCollectionRef, notification.notification_id)
        await setDoc(notificationDocRef, { read_status: true }, { merge: true })
    }

    return (
        <article className='flex items-start gap-4 py-4' onClick={markNotificationAsRead}>
            <div className={cn(notification.read_status && "!text-muted-foreground")}>
                {getNotificationIcon()}
            </div>

            <section className={cn('flex flex-col w-full text-sm mr-2', notification.read_status && "!text-muted-foreground")}>
                {renderNotificationContent()}
            </section>

            <button onClick={deleteNotification} className='ml-auto'>
                <Trash2 size={15} stroke='red' />
            </button>
        </article>
    )
}

export default NotificationCard;