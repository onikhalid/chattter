import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Bell } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetClose, Button, SheetFooter } from '../ui';
import { UserContext } from '@/contexts';
import notificationSound from '@/assets/notification.wav';
import NotificationCard from './NotificationCard';
import { useBooleanStateControl } from '@/hooks';

const audio = new Audio(notificationSound);

const NotificationsDrawer = () => {
    const { userNotifications, isUserDataLoading } = useContext(UserContext);
    const [previousNotificationCount, setPreviousNotificationCount] = useState(!isUserDataLoading ? 0 : userNotifications.length);
    const hasUnreadNotifications = useMemo(() => userNotifications.some(notification => !!notification.read_status), [userNotifications, isUserDataLoading]);
    const unreadNotificationCount = useMemo(() => userNotifications.filter(notification => !notification.read_status).length, [userNotifications, isUserDataLoading]);
    const {
        state: isDrawerOpen,
        setTrue: openDrawer,
        setFalse: closeDrawer
    } = useBooleanStateControl()

    const playSound = useCallback(() => {
        audio.play().catch((error) => {
            console.error("Audio play failed:", error);
        });
    }, []);

    useEffect(() => {
        if (isUserDataLoading) return;
        if (!isUserDataLoading && (userNotifications.length > previousNotificationCount) && hasUnreadNotifications) {
            playSound();
            setPreviousNotificationCount(userNotifications.length);
        }
    }, [userNotifications.length, previousNotificationCount, playSound, isUserDataLoading]);



    return (
        <Sheet open={isDrawerOpen} >
            <SheetTrigger className='relative' data-testid="menu-button" onClick={openDrawer}>
                <Bell size={24} />
                {
                hasUnreadNotifications && (
                    <span className="absolute top-0 right-0 flex items-center justify-center min-w-2 px-1 h-4 text-xs bg-red-500 text-white rounded-full">
                        {unreadNotificationCount}
                    </span>
                )}

            </SheetTrigger>
            <SheetContent className='flex flex-col pt-[2.5vh] max-h-screen overflow-y-scroll' onPointerDownOutside={closeDrawer}>
                <SheetHeader className='flex flex-row items-center justify-end w-full'>
                    <SheetClose>
                        <Button variant='secondary'>Close</Button>
                    </SheetClose>
                </SheetHeader>
                <section className='w-full'>
                    <header>
                        <h1 className='text-2xl font-semibold font-display'>Notifications ({userNotifications.length})</h1>
                    </header>
                    <div className='flex flex-col grow w-full divide-y'>
                        {userNotifications.map((notification, index) => (
                            <NotificationCard key={index} notification={notification} closeDrawer={closeDrawer} />
                        ))}
                    </div>
                </section>
                <SheetFooter className='flex flex-col gap-4 w-full'>
                    {/* Footer content */}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default NotificationsDrawer;