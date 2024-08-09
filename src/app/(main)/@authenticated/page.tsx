'use client'

import React from 'react'
import { Button, Input, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { PenIcon, SearchIcon } from '@/components/icons';
import { SectionAll, SectionFollowing, SectionForYou } from './misc/components';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { PlusIcon, } from 'lucide-react';


const AuthenticatedUserHomePage = () => {
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
        <main className="relative grow w-full lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <Tabs value={view} className='relative w-full max-w-[1200px] mx-auto'>
                <TabsList className="sticky top-0 flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1 h-max z-[3] shadow-sm">
                    <div className="w-full  px-6 pt-4 md:flex items-center justify-center border-muted-foreground/40 dark:border-muted border-b-2">
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

                {
                    tabsArray.map((tab) => (
                        <TabsContent
                            className="mt-0 h-full w-full rounded-sm overflow-x-hidden"
                            key={tab.id}
                            value={tab.id}
                        >
                            <div className="flex flex-col items-center justify-center w-full rounded-10">
                                {tab.component}
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>

            <section className='sticky top-0 max-h-20 bg-black text-white'>
                <h1>Pickolene</h1>
            </section>
        </main>
    )
}

export default AuthenticatedUserHomePage