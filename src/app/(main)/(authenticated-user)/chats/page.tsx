'use client'
import React, { useContext } from 'react'
import useUserChatSessions from '../misc/api/getUserChats'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserContext } from '@/contexts'
import { Avatar, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/utils/classNames'
import { Chat } from '../misc/components'
import Link from 'next/link'

const ChatsPage = () => {
    const router = useRouter()
    const { data, error, isLoading } = useUserChatSessions()
    const { authenticatedUser, isUserDataLoading } = useContext(UserContext)
    const queryParams = useSearchParams()
    const currentChat = queryParams.get('chat')

    const tabsArray = data?.map(chat => ({
        label: (
            <article className='size-full flex items-start gap-3'>
                <Avatar src={chat.receiver_avatar} alt={chat.receiver_name} fallback={chat.receiver_name} className='w-10 h-10 mr-2 text-sm' />
                <section className='flex flex-col grow'>
                    <div className='flex items-center w-full'>
                        <p>{chat.receiver_name}</p>
                    </div>
                    <div className='w-full flex items-center justify-between gap-4 text-xs text-muted-foreground'>
                        {chat.last_message}
                        <p className='ml-auto'>
                            {chat.unread_count > 0 && (
                                <span className='bg-primary text-white text-xs rounded-full px-1'>{chat.unread_count}</span>
                            )}
                        </p>
                    </div>
                </section>
            </article>
        ),
        id: chat.chat_id,
        content: <div>Chat with: {chat.chat_id}</div>,
        receiver_id: chat.receiver_id
    })) || []

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const isSmallScreen = window.matchMedia("(max-width: 680px)").matches;
    const shouldShowTabsList = !isSmallScreen || (isSmallScreen && !currentChat);
    const shouldShowTabsContent = currentChat;
    console.log(isSmallScreen, "isSmallScreen")
    return (
        <main className="relative grow w-full px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <Tabs defaultValue={tabsArray[0]?.id} className='grid lg:grid-cols-[0.4fr,1fr] gap-4 h-full' value={currentChat || ""}>
                {
                    shouldShowTabsList && (
                        <TabsList className='flex flex-col h-full overflow-y-scroll justify-start divide-y-2 bg-none bg-transparent border-r border-l rounded-none'>
                            {
                                tabsArray.map((tab) => (
                                    <Link key={tab.id} href={`/chats?chat=${tab.id}`} passHref className='w-full inline-block'>
                                        <TabsTrigger
                                            className={cn(
                                                'flex items-center justify-start w-full p-4 gap-4 text-sm font-semibold text-inherit',
                                                'hover:bg-primary/10',
                                                'data-[state=active]:text-primary'
                                            )}
                                            value={tab.id}
                                        >
                                            {tab.label}
                                        </TabsTrigger>
                                    </Link>
                                ))
                            }
                        </TabsList>
                    )}
                {
                    shouldShowTabsContent ? (
                        tabsArray.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className='!max-h-full !m-0 overflow-hidden !p-0'>
                                <Chat chat_id={tab.id} current_user_id={authenticatedUser?.uid || ""} receiver_id={tab.receiver_id} />
                            </TabsContent>
                        ))
                    )
                        :
                        (
                            <>
                            </>
                        )
                }
            </Tabs>
        </main>
    )
}

export default ChatsPage
