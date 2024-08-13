'use client'

import React, { useContext, useEffect, useMemo } from 'react'
import { UserContext } from '@/contexts'
import { Ellipsis, Eye, User, UserPlus } from 'lucide-react'
import { TPost } from '../types'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import Link from 'next/link'
import { BestPerformingPostsByLikesTable, BestPerformingPostsByViewsTable } from './tables'
import BestPerformingPostsSection from './tables/BestPerformingPostsSection'


const PrivateProfileAnalyticsDashboard = () => {
    const { isUserDataLoading, userData, userFollows, userFollowers, userPosts, userInterests, userBookmarks } = useContext(UserContext)



    const getBestPerformingPostsByLikes = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        return sortedPosts.slice(0, 5);
    }
    const getWorsePerformingPostsByLikes = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0));
        return sortedPosts.slice(0, 5);
    }
    const getBestPerformingPostsByTotalReads = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => b.total_reads - a.total_reads);
        return sortedPosts.slice(0, 5);
    }
    const getWorsePerformingPostsByTotalReads = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => a.total_reads - b.total_reads);
        return sortedPosts.slice(0, 5);
    }
    const getBestPerformingPostsByBookmarks = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
        return sortedPosts.slice(0, 5);
    }

    const getBiggestSupportersByPostLikes = () => {
        const uniqueLikers = userPosts.map(post => post.likes).flat().filter((v, i, a) => a.indexOf(v) === i);
        const uniqueLikesCount = uniqueLikers.map(liker => {
            const likes = userPosts.map(post => post.likes);
            const count = likes.flat().filter(like => like === liker).length;
            return { liker, count };
        })
        const sortedLikes = uniqueLikesCount.sort((a, b) => b.count - a.count);
        console.log(sortedLikes)
        return sortedLikes.slice(0, 5);
    }


    const bestPerformingPostsByLikes = useMemo(() => getBestPerformingPostsByLikes(), [userPosts]);
    const worsePerformingPostsByLikes = useMemo(() => getWorsePerformingPostsByLikes(), [userPosts]);
    const bestPerformingPostsByTotalReads = useMemo(() => getBestPerformingPostsByTotalReads(), [userPosts]);
    const worsePerformingPostsByTotalReads = useMemo(() => getWorsePerformingPostsByTotalReads(), [userPosts]);
    const bestPerformingPostsByBookmarks = useMemo(() => getBestPerformingPostsByBookmarks(), [userPosts]);
    const biggestSupportersByPostLikes = useMemo(() => getBiggestSupportersByPostLikes(), [userFollowers]);
    useEffect(() => {
        console.log(bestPerformingPostsByLikes)
        console.log(worsePerformingPostsByLikes)
        console.log(bestPerformingPostsByTotalReads)
        console.log(worsePerformingPostsByTotalReads)
        console.log(biggestSupportersByPostLikes, "biggestSupportersByPostLikes")
    }, [bestPerformingPostsByLikes, worsePerformingPostsByLikes, bestPerformingPostsByTotalReads, worsePerformingPostsByTotalReads, biggestSupportersByPostLikes])




    return (
        <main className='grow relative flex flex-col w-full max-w-[550px] h-full lg:max-w-[1200px] mx-auto'>
            <section>
                <header className='flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4'>
                    <h1 className='text-xl font-semibold'>
                        Posts Analytics
                    </h1>
                </header>


                <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 py-6'>
                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total posts</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userPosts.length}
                        </h3>
                    </article>

                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total posts saved</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userBookmarks.length}
                        </h3>
                    </article>

                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total tags followed</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userInterests.length}
                        </h3>
                    </article>

                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total posts liked</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userInterests.length}
                        </h3>
                    </article>

                </section>


                <section className='flex flex-col w-full overflow-x-scroll'>
                    {/* <BestPerformingPostsByLikesTable data={bestPerformingPostsByLikes} />
                    <BestPerformingPostsByViewsTable data={bestPerformingPostsByLikes} /> */}

                    <BestPerformingPostsSection 
                        bestPerformingPostsByLikes={bestPerformingPostsByLikes}
                        bestPerformingPostsByTotalReads={bestPerformingPostsByTotalReads}
                        bestPerformingPostsByBookmarks={bestPerformingPostsByBookmarks}
                    />
                </section>

            </section>

            <section>
                <header className='flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4'>
                    <h1 className='text-xl font-semibold'>
                        Personal Analytics
                    </h1>
                </header>


                <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 py-6'>
                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total followers</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userFollowers.length}
                        </h3>
                    </article>

                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total following</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userFollows.length}
                        </h3>
                    </article>

                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total tags followed</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userInterests.length}
                        </h3>
                    </article>

                </section>
            </section>
        </main>
    )
}

export default PrivateProfileAnalyticsDashboard