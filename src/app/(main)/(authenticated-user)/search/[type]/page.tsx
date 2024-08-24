'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

import { Input, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils';

import { SearchPeople, SearchPosts, SearchTags } from '../../misc/components';
import { SearchIcon } from 'lucide-react';


const SearchResultPage = ({ params }: { params: { type: string } }) => {

    const { type } = params
    const router = useRouter()
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const tabsArray = [
        {
            label: 'Posts',
            id: query ? `posts?q=${query}` : 'posts',
            component: <SearchPosts />
        },
        {
            label: "Tags",
            id: query ? `tags?q=${query}` : 'tags',
            component: <SearchTags />
        },
        {
            label: "People",
            id: query ? `people?q=${query}` : 'people',
            component: <SearchPeople />,
        },
    ]

    const [hasErrors, setHasErrors] = useState(false)
    const [searchText, setSearchText] = useState(query || "")
    const handleInputChange = (newValue: string) => {
        setSearchText(newValue)
        if (newValue.length > 0) {
            setHasErrors(false)
        }
    }
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchText.length < 3) {
            setHasErrors(true)
            return
        }
        router.push(`/search/${type}?q=${searchText}`)
    }

    if (type !== 'posts' && type !== 'tags' && type !== 'people') {
        router.push('/search')
    }
    return (
        <main className="relative grow w-full lg:grid grid-rows-[max-content,1fr] px-4 lg:px-[7.5vw] lg:gap-[0] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <form className='relative w-full max-w-[1000px] mx-auto' onSubmit={(e) => handleSearch(e)}>
                <Input
                    name='search-input'
                    className='mt-4 '
                    placeholder='Search for posts, users, tags, etc...'
                    value={searchText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    type='search'
                    hasError={hasErrors}
                    errorMessage={searchText.length == 0 ? 'Please enter a search term' : 'Please enter at least 3 characters'}
                />
                <button>
                    <SearchIcon className='absolute top-[45%] right-4 transform -translate-y-1/2 text-muted-foreground' />
                </button>
            </form>


            <Tabs value={type} className='relative flex flex-col w-full max-w-[1000px] mx-auto'>
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
                                                type === tab.id.split("?q=")[0] ? 'text-primary' : 'text-muted-foreground'
                                            )}
                                            href={`./${tab.id}`}
                                            variant='unstyled'
                                        >
                                            {' '}
                                            {tab.label}
                                        </LinkButton>
                                        <div className={
                                            cn(
                                                "absolute -bottom-[2px] left-0 w-full h-[2px] bg-primary opacity-0",
                                                "group-hover/trigger:opacity-30",
                                                type === tab.id.split("?q=")[0] && "!opacity-100"
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
                            value={tab.id.split("?q=")[0]}
                        >
                            <div className="flex flex-col items-center justify-center w-full min-h-full rounded-10">
                                {tab.component}
                            </div>
                        </TabsContent>
                    ))
                }
            </Tabs>
        </main>
    )
}

export default SearchResultPage