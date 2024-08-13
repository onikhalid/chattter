'use client'
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'

import { Avatar, Button, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils';

import { PublicProfileDetails, PublicProfilePosts } from '../misc/components';
import { UseFollowUser, UseGetUserPublicProfileDetails, UseUnFollowUser } from '../misc/api';
import Image from 'next/image';
import { SmallSpinner } from '@/components/icons';
import { auth } from '@/utils/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { UserContext } from '@/contexts';


const UserPublicProfilePage = () => {
    const { isUserDataLoading, userData, userFollows, userFollowers } = useContext(UserContext)

    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'posts';
    const tabsArray = [
        {
            label: "Posts",
            id: 'posts',
            component: <PublicProfilePosts username={userData?.username!} />
        },
        {
            label: "Archive",
            id: 'archive',
            component: <PublicProfilePosts username={userData?.username!} />
        },
        {
            label: 'Archive',
            id: 'archive',
            component: <PublicProfileDetails />
        },
        {
            label: 'Analytics',
            id: 'archive',
            component: <PublicProfileDetails />
        },
    ]
   



    return (
        <main className="relative grow w-full lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            {
                isUserDataLoading ?

                    <div className='flex items-center justify-center w-full h-full col-span-2'>
                        <SmallSpinner className='w-10 h-10 animate-spin text-primary' />
                    </div>

                    :
                    (!isUserDataLoading && userData) ?
                        <>
                            <Tabs value={view} className='relative flex flex-col w-full max-w-[1200px] mx-auto'>
                                <TabsList className="sticky top-0 flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1 h-max z-[3] shadow-sm overflow-x-scroll">
                                    <div className="w-full px1.5 md:px-6 pt-4 flex items-center justify-center border-muted-foreground/40 dark:border-muted border-b-2 max-md:justify-start">
                                        {
                                            tabsArray.map((tab, index) => {
                                                return (
                                                    <TabsTrigger
                                                        className={cn(
                                                            'relative w-fit rounded-none !p-0 text-muted border-0 !bg-none outline-none !shadow-none transition-all sm:w-auto hover:!border-b-primary/30 bg-background',
                                                            'group/trigger !w-1/3',
                                                            'data-[state=active]:text-muted-foreground'
                                                        )}
                                                        key={index}
                                                        value={`${tab.id}`}
                                                    >
                                                        <LinkButton
                                                            className={cn("bg-transparent text-sm font-semibold text-inherit py-1.5 w-full",
                                                                view === tab.id ? 'text-primary' : 'text-muted-foreground'
                                                            )}
                                                            href={`?view=${tab.id}`}
                                                            variant='unstyled'
                                                        >
                                                            {' '}
                                                            {tab.label}
                                                        </LinkButton>
                                                        <div className={
                                                            cn(
                                                                "absolute -bottom-[2px] left-0 w-full h-[2px] bg-primary opacity-0",
                                                                "group-hover/trigger:opacity-30",
                                                                view === tab.id && "!opacity-100"
                                                            )
                                                        } />
                                                    </TabsTrigger>
                                                )
                                            })
                                        }
                                    </div>
                                </TabsList>

                                {
                                    tabsArray.map((tab) => (
                                        <TabsContent
                                            className="grow mt-0 h-full w-full rounded-sm overflow-x-hidden"
                                            key={tab.id}
                                            value={tab.id}
                                        >
                                            <div className="flex flex-col items-center justify-start w-full min-h-full rounded-10">
                                                {tab.component}
                                            </div>
                                        </TabsContent>
                                    ))
                                }
                            </Tabs>

                            <section className='sticky top-0 flex flex-col max-h-[90vh]'>
                                {
                                    userData &&
                                    <article className='flex flex-col items-center text-center py-10 my-auto'>
                                        <div>
                                            <Avatar
                                                src={userData.avatar}
                                                alt={userData.username}
                                                fallback={userData.name!}
                                                className='rounded-full h-28 w-28 '
                                                fallbackClass='text-2xl'
                                            />
                                        </div>

                                        <div className='pt-2 pb-1'>
                                            <h2 className='text-xl font-medium m-0'>
                                                {userData.name}
                                            </h2>
                                            <span className='text-muted-foreground text-sm italic'>
                                                @{userData.username}
                                            </span>
                                        </div>



                                        <div className='flex items-center gap-4'>
                                            <p className='flex flex-col text-2xl font-semibold'>
                                                {userFollowers?.length || 0}
                                                <span className='text-sm text-muted-foreground'>
                                                    Followers
                                                </span>
                                            </p>
                                            <p className='flex flex-col text-2xl font-semibold'>
                                                {userFollows?.length || 0}
                                                <span className='text-sm text-muted-foreground'>
                                                    Following
                                                </span>
                                            </p>
                                        </div>

                                        <p className='text-sm text-foreground py-2.5'>
                                            {userData.bio}
                                        </p>
                                    </article>
                                }
                            </section>
                        </>
                        :
                        null
            }

        </main>
    )
}

export default UserPublicProfilePage