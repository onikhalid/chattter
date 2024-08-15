'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';

import { Badge, Button, LinkButton, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';
import { cn } from '@/lib/utils';
import { UserContext } from '@/contexts';

import { TPost } from '../types';
import { QueryResult } from '../api/getPostsAll';
import { useAddInterest, usePostsByTagInfiniteQuery, useRemoveInterest } from '../api';
import { usePostsBySearchInfiniteQuery } from '../api';
import { useSearchParams } from 'next/navigation';

type SortOption = 'date_desc' | 'date_asc' | 'alpha_asc' | 'alpha_desc' | 'likes_desc' | 'likes_asc';

const SearchPosts = () => {
    const [sortBy, setSortBy] = useState<SortOption>('date_desc');
    const searchParams = useSearchParams();
    const search_text = searchParams.get('q') || '';

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        status,
        error,
        refetch
    } = usePostsBySearchInfiniteQuery(decodeURI(search_text), sortBy);
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleSortChange = (value: string) => {
        setSortBy(value as SortOption);
        refetch();
    };





    return (
        <section className='grow relative flex flex-col w-full max-w-[550px] h-full lg:max-w-[1200px] mx-auto'>
            <div className={cn('flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4',
                data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && "hidden")}
            >
                <Select onValueChange={handleSortChange} defaultValue={sortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="date_desc">Newest First</SelectItem>
                        <SelectItem value="date_asc">Oldest First</SelectItem>
                        <SelectItem value="alpha_asc">Title A-Z</SelectItem>
                        <SelectItem value="alpha_desc">Title Z-A</SelectItem>
                        <SelectItem value="likes_desc">Most Likes</SelectItem>
                        <SelectItem value="likes_asc">Fewest Likes</SelectItem>
                    </SelectContent>
                </Select>
            </div>


            <div className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
                {
                    isLoading && Array.from({ length: 10 }).map((_, i) => (
                        <PostCardSkeleton key={i} />
                    ))
                }
            </div>


            {
                data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && !isLoading && (
                    <div className='grow flex flex-col items-center justify-center size-full my-auto'>
                        <article className='bg-background p-6 lg:p-10 rounded-3xl max-md:rounded-b-none mx-auto w-full max-w-[525px]'>
                            <h3 className='text-5xl font-medium'>No posts found.</h3>
                            <p className='my-5'>
                                We couldn&apos;t find any post related to this query &quot;{search_text}&quot; on Chattter, change your query and try again later.
                            </p>

                            <LinkButton href='/new' className='mt-4 md:mt-10 px-12 py-6 text-lg'>
                                Create a new post
                            </LinkButton>
                        </article>
                    </div>
                )
            }


            {
                data?.pages.map((page: QueryResult, i: number) => (
                    <div key={i} className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
                        {
                            page.posts.map((post: TPost) => (
                                <PostCard
                                    key={post.post_id}
                                    post={post} />
                            ))
                        }
                    </div>
                ))
            }


            <div ref={ref} className='w-full'>
                {
                    isFetchingNextPage
                        ?
                        <div className='flex flex-col divide-y-[1.5px] w-full divide-muted-foreground dark:divide-muted'>
                            {
                                Array.from({ length: 4 }).map((_, i) => (
                                    <PostCardSkeleton key={i} />
                                ))
                            }
                        </div>

                        :
                        hasNextPage
                            ? null
                            :
                            <div className={cn('mt-8 py-5 w-full text-center ', data?.pages.reduce((total, page) => total + page.posts.length, 0) == 0 && "hidden")}>
                                <span className='font-sans'>&mdash;&mdash;</span>
                                {" "}End{" "}
                                <span className='font-sans'>&mdash;&mdash;</span>
                            </div>
                }
            </div>
        </section>
    )
}

export default SearchPosts