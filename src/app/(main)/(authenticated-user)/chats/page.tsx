'use client'
import React, { useContext } from 'react'
import useUserChatSessions from '../misc/api/getUserChats'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserContext } from '@/contexts'
import { Avatar, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/utils/classNames'
import { Chat } from '../misc/components'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const ChatsPage = () => {
    const router = useRouter()
    const { data, error, isLoading } = useUserChatSessions()
    const { authenticatedUser, isUserDataLoading, userFollowsProfiles } = useContext(UserContext)
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
        receiver_id: chat.receiver_id,
        unread_count: chat.unread_count
    })) || []

    if (isLoading) {
        return <div className='w-full h-full flex items-center justify-center'>Loading...</div>
    }
    if (!isLoading && !data) {
        return <div className='w-full h-full flex items-center justify-center'>
            {
                (!isUserDataLoading && !authenticatedUser) ?

                    <div className='w-[85%] max-w-[450px] mx-auto'>
                        <h3 className='font-medium text-3xl xl:text-5xl text-balance max-w-[28ch]'>
                            Login to chatter to chat with other users.
                        </h3>

                        <LinkButton href="/login" className='text-lg min-h-12 w-full max-w-[450px] mt-12'>
                            Login
                        </LinkButton>
                    </div>

                    :
                    <h3></h3>
            }
        </div>
    }

    if (error) {
        return <div className='w-full h-full flex items-center justify-center'>Error:
            {error.message}
        </div>
    }

    const isSmallScreen = window.matchMedia("(max-width: 680px)").matches;
    const shouldShowTabsList = !isSmallScreen || (isSmallScreen && !currentChat);
    const shouldShowTabsContent = currentChat;




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
                    shouldShowTabsContent ?
                        tabsArray.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className='!max-h-full !m-0 overflow-hidden !p-0'>
                                <Chat
                                    chat_id={tab.id}
                                    current_user_id={authenticatedUser?.uid || ""}
                                    receiver_id={tab.receiver_id}
                                    unread_count={tab.unread_count}
                                />
                            </TabsContent>
                        ))

                        :

                        <div className='flex items-center justify-center w-full h-full p-4 border-r'>

                            {
                                data?.length == 0 ?
                                    <div className='flex flex-col w-[90%] max-w-[500px]'>
                                        <h3 className='text-2xl xl:text-5xl font-medium text-balance' >
                                            You haven&apos;t started chatting with anyone yet.
                                        </h3>


                                    </div>
                                    :
                                    <div className='flex flex-col'>
                                        <MessageCircle size={40} />
                                        <h3 className='text-2xl xl:text-5xl font-medium text-balance' >
                                            Select a user to chat with .
                                        </h3>

                                    </div>
                            }
                        </div>

                }
            </Tabs>
        </main>
    )
}

export default ChatsPage
