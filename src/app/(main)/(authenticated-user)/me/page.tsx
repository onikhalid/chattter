'use client'
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'

import { Avatar, Badge, Button, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils';

import { EditProfileModal, PublicProfileBookmarks, PublicProfileDetails, PublicProfilePosts, UserProfileDetailsArticle } from '../misc/components';
import { UseFollowUser, UseGetUserPublicProfileDetails, UseUnFollowUser } from '../misc/api';
import Image from 'next/image';
import { SmallSpinner } from '@/components/icons';
import { auth } from '@/utils/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';
import { UserContext } from '@/contexts';
import Link from 'next/link';
import { useBooleanStateControl } from '@/hooks';


const UserPublicProfilePage = () => {
    const { isUserDataLoading, userData, userFollows, userFollowers, userInterests, userBookmarks } = useContext(UserContext)
    const {
        state: isEditProfileModalOpen,
        setTrue: openEditProfileModal,
        setFalse: closeEditProfileModal
    } = useBooleanStateControl()

    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'posts';
    const tabsArray = [
        {
            label: 'Details',
            id: 'details',
            component: <UserProfileDetailsArticle
                userData={userData}
                userFollowers={userFollowers}
                userFollows={userFollows}
                userInterests={userInterests}
                openEditProfileModal={openEditProfileModal}
            />,
            only_mobile: true
        },
        {
            label: "Posts",
            id: 'posts',
            component: <PublicProfilePosts username={userData?.username!} />
        },
        {
            label: "Bookmarks",
            id: 'bookmarks',
            component: <PublicProfileBookmarks bookmarks={userBookmarks} />
        },
        // {
        //     label: 'Archive',
        //     id: 'arrchive',
        //     component: <PublicProfileDetails />
        // },
        {
            label: 'Analytics',
            id: 'analytics',
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
                                {/* <TabsList className="sticky top-0 flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1 minn-h-max z-[3] shadow-sm overflow-x-scroll"> */}
                                <TabsList className={"sticky top-0 flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1 h-max z-[3] shadow-sm max-md:overflow-x-scroll"}>
                                    <div className="w-full px-1.5 md:px-6 pt-4 flex items-center justify-center border-muted-foreground/40 dark:border-muted border-b-2 max-md:justify-start">
                                        {
                                            tabsArray.map((tab, index) => {
                                                return (
                                                    <TabsTrigger
                                                        className={cn(
                                                            'relative w-fit rounded-none !p-0 text-muted border-0 !bg-none outline-none !shadow-none transition-all sm:w-auto hover:!border-b-primary/30 bg-background',
                                                            'group/trigger !w-1/3',
                                                            'data-[state=active]:text-muted-foreground',
                                                            tab.only_mobile && "md:hidden"
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

                            <section className='sticky top-0 flex flex-col max-h-[90vh] max-md:hidden'>
                                <UserProfileDetailsArticle
                                    userData={userData}
                                    userFollowers={userFollowers}
                                    userFollows={userFollows}
                                    userInterests={userInterests}
                                    openEditProfileModal={openEditProfileModal}
                                />
                            </section>
                        </>
                        :
                        null
            }

            <EditProfileModal
                isModalOpen={isEditProfileModalOpen}
                closeModal={closeEditProfileModal}
                userData={userData}
                isUserDataLoading={isUserDataLoading}
            />

        </main>
    )
}

export default UserPublicProfilePage