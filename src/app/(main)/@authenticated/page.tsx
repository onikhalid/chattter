'use client'

import React, { useState } from 'react'
import { Avatar, Button, ChatterLogo, Input, LinkButton, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseConfig';
import { getInitials } from '@/utils/strings';
import { PenIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { SectionAll, SectionFollowing, SectionForYou } from './misc/components';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';


const AuthenticatedUserHomePage = () => {
    const [user, loading] = useAuthState(auth);
    const searchParams = useSearchParams();
    const view = searchParams.get('v') || 'for-you';
    const tabsArray = [
        {
            label: 'For you',
            id: 'for-you',
            component: <SectionForYou />
        },
        {
            label: "Feed",
            id: 'all',
            component: <SectionAll />
        },
        {
            label: "Following",
            id: 'following',
            component: <SectionFollowing />
        },
    ]

    return (
        <main className="flex flex-col h-screen items-center justify-between font-display overflow-hidden">
            <header className="sticky top-0 flex items-center justify-between w-full px-5 py-3 md:px-10 md:py-4 border-b-[0.3px] border-b-[#E4E7EC]">
                <ChatterLogo />
                <section className='flex items-center gap-2'>
                    <LinkButton href='/new' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
                        Write story <PenIcon />
                    </LinkButton>

                    <Popover>
                        <PopoverTrigger>
                            <Avatar alt='' fallback={getInitials(user?.displayName! || "")} src={user?.photoURL} />
                        </PopoverTrigger>
                        <PopoverContent>
                            <div>
                                <span className="text-sm">Signed in as</span>
                                <h6 className="font-semibold">{user?.displayName}</h6>
                            </div>
                        </PopoverContent>
                    </Popover>
                </section>
            </header>


            <div className="grow w-full lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] pt-8">
                <section className='overflow-y-scroll w-full max-w-[1200px] mx-auto'>
                    <header className='flex items-center justify-between gap-10 border-b pt-8 pb-4'>
                        <Button variant='ghost' className='flex items-center gap-1.5'>
                            <PlusIcon />
                            Add interest
                        </Button>


                        <Input
                            placeholder='by topics or title'
                            className='w-[220px] md:w-[300px]'
                            leftIcon={<SearchIcon />}
                        />

                        <LinkButton href='new-story' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
                            Write story <PenIcon />
                        </LinkButton>
                    </header>


                    <section>
                        <Tabs defaultValue='for-you'>
                            <div className="w-full ">
                                <TabsList className="flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1  h-max">
                                    <div className="hidden w-full  px-6 pt-4 md:flex items-center justify-center border-muted border-b-2">
                                        {
                                            tabsArray.map((tab, index) => {
                                                return (
                                                    <TabsTrigger
                                                        className={cn(
                                                            'relative w-fit rounded-none !p-0 text-[#394157] border-0 !bg-none outline-none !shadow-none transition-all sm:w-auto hover:!border-b-primary/30 bg-background',
                                                            'group/trigger !w-1/3',
                                                            'data-[state=active]:text-[#032282]  '
                                                        )}
                                                        key={index}
                                                        value={`${tab.id}`}
                                                    >
                                                        <LinkButton
                                                            className={cn("bg-transparent text-sm font-semibold text-inherit py-1.5 px-4 ",
                                                                view === tab.id ? 'text-[#032282]' : 'text-inherit'
                                                            )}
                                                            href={`?v=${tab.id}`}
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
                            </div>

                            {
                                tabsArray.map((tab) => (
                                    <TabsContent
                                        className="mt-0 h-full w-full rounded-sm overflow-x-hidden"
                                        key={tab.id}
                                        value={tab.id}
                                    >
                                        <div className="flex flex-col items-center justify-center rounded-10">
                                            {tab.component}
                                        </div>
                                    </TabsContent>
                                ))
                            }
                        </Tabs>
                    </section>

                </section>
            </div>
            {/* <footer className="sticky bottom-0 flex items-center justify-between bg-black text-background w-full p-4 max-md:text-xs">
            <small>&copy; 2024 Chatter. All rights reserved</small>
            <span>
              Built with ❤️ by
              <a href="https://github.com/onikhalid" target="_blank" className="ml-1.5 underline decoration-white hover:decoration-primary">
                Khalid.
              </a>
            </span>
          </footer> */}
        </main>
    )
}

export default AuthenticatedUserHomePage