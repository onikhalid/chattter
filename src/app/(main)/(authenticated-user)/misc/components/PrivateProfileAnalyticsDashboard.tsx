'use client'

import React, { useContext, useEffect, useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Label, Pie, PieChart } from "recharts"

import { UserContext } from '@/contexts'
import BestPerformingPostsSection from './tables/BestPerformingPostsSection'
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"



const PrivateProfileAnalyticsDashboard = () => {
    const { isUserDataLoading, userData, userFollows, userFollowers, userPosts, userInterests, userBookmarks } = useContext(UserContext)

    const getBestPerformingPostsByLikes = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        return sortedPosts.slice(0, 5);
    }
    const getBestPerformingPostsByTotalEngagement = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => ((b.likes?.length || 0) + (b.total_reads || 0) + (b.bookmarks?.length || 0)) - ((a.likes?.length || 0) + (a.total_reads || 0) + (a.bookmarks?.length || 0)));
        return sortedPosts.slice(0, 5);
    }
    const getWorsePerformingPostsByLikes = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0));
        return sortedPosts.slice(0, 5);
    }
    const getBestPerformingPostsByTotalReads = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (b.total_reads || 0) - (a.total_reads || 0));
        return sortedPosts.slice(0, 5);
    }
    const getWorsePerformingPostsByTotalReads = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (a.total_reads || 0) - (b.total_reads || 0));
        return sortedPosts.slice(0, 5);
    }
    const getBestPerformingPostsByBookmarks = () => {
        const posts = userPosts;
        const sortedPosts = posts.sort((a, b) => (b.bookmarks?.length || 0) - (a.bookmarks?.length || 0));
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


    const getTotalEngagementData = useMemo(() => {
        const likes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
        const bookmarks = userPosts.reduce((sum, post) => sum + (post.bookmarks?.length || 0), 0);
        const views = userPosts.reduce((sum, post) => sum + (post.total_reads || 0), 0);
        return { likes, bookmarks, views }
    }, [userPosts]);

    const totalEngagements = getTotalEngagementData.likes + getTotalEngagementData.bookmarks + getTotalEngagementData.views;

    const bestPerformingPostsByLikes = useMemo(() => getBestPerformingPostsByLikes(), [userPosts]);
    const bestPerformingPostsByTotalEngagement = useMemo(() => getBestPerformingPostsByTotalEngagement(), [userPosts]);
    const worsePerformingPostsByLikes = useMemo(() => getWorsePerformingPostsByLikes(), [userPosts]);
    const bestPerformingPostsByTotalReads = useMemo(() => getBestPerformingPostsByTotalReads(), [userPosts]);
    const worsePerformingPostsByTotalReads = useMemo(() => getWorsePerformingPostsByTotalReads(), [userPosts]);
    const bestPerformingPostsByBookmarks = useMemo(() => getBestPerformingPostsByBookmarks(), [userPosts]);
    const biggestSupportersByPostLikes = useMemo(() => getBiggestSupportersByPostLikes(), [userFollowers]);



    const bestComparisonChartData = bestPerformingPostsByTotalEngagement.map(post => {
        return {
            title: post.title,
            likes: post.likes?.length || 0.015,
            reads: post.total_reads || 0.015,
            bookmarks: post.bookmarks?.length || 0.015,
        }
    })
    const bestComparisonChartConfig = {
        likes: {
            label: "Likes",
            color: "#2563eb",
        },
        reads: {
            label: "Reads",
            color: "#60a5fa",
        },
        bookmarks: {
            label: "Bookmarks",
            color: "#93c3fd",
        },
    } satisfies ChartConfig

    const totalEngagementDistributionChartData = [
        { label: "likes", value: getTotalEngagementData.likes, fill: "#2563eb" },
        { label: "bookmarks", value: getTotalEngagementData.bookmarks, fill: "#93c3fd" },
        { label: "views", value: getTotalEngagementData.views, fill: "#60a5fa" },
    ]
    const totalEngagementDistributionChartConfig = {
        likes: {
            label: "Likes",
            color: "#2563eb",
        },
        views: {
            label: "Reads/Views",
            color: "#60a5fa",
        },
        bookmarks: {
            label: "Bookmarks",
            color: "#93c3fd",
        },
    } satisfies ChartConfig



    return (
        <main className='grow relative flex flex-col w-full max-w-[550px] h-full lg:max-w-[1200px] mx-auto'>
            <section>
                <header className='flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4'>
                    <h3 className='text-xl font-semibold'>
                        Personal Summary
                    </h3>
                </header>

                <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 py-6'>
                    <article className='p-4 px-6 rounded-lg border border-secondary'>
                        <span className='text-muted-foreground'>Total posts</span>
                        <h3 className='text-4xl xl:text-5xl font-semibold'>
                            {userPosts.length}
                        </h3>
                    </article>

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
            </section>


            <section className='my-5'>
                <header className='flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4'>
                    <h3 className='text-xl font-semibold'>
                        Posts Engagements
                    </h3>
                </header>

                <div className='grid lg:grid-cols-[1fr,0.6fr] items-center lg:items-stretch md:gap-10'>
                    <ChartContainer config={bestComparisonChartConfig} className="max-md:min-h-[200px] min-h-[150px] w-full max-w-[550px]">
                        <BarChart accessibilityLayer data={bestComparisonChartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="title"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tick={{ display: 'none' }}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    label={true}
                                    indicator='line'
                                    labelKey='title'
                                    nameKey='title'
                                />}
                            />
                            <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
                            <Bar dataKey="reads" fill="var(--color-reads)" radius={4} />
                            <Bar dataKey="bookmarks" fill="var(--color-bookmarks)" radius={4} />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    </ChartContainer>


                    <ChartContainer
                        config={totalEngagementDistributionChartConfig}
                        className="aspect-square max-h-[350px]"

                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={totalEngagementDistributionChartData}
                                nameKey="label"
                                dataKey="value"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalEngagements.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Impressions
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className='grid lg:grid-cols-[1fr,0.6fr] items-center lg:items-stretch md:gap-10'>
                    <p className='text-center mt-4'>Enagement Distribution for posts with the most engagement</p>
                    <p className='text-center mt-4'>Enagement Distribution for all posts.</p>
                </div>
            </section>


            <section>
                <header className='flex items-center border-b-[1.5px] w-full border-muted-foreground dark:border-muted py-4 mt-4'>
                    <h3 className='text-xl font-semibold'>
                        Best Performing Posts
                    </h3>
                </header>
                <div className='flex flex-col w-full overflow-x-scroll'>
                    {/* <BestPerformingPostsByLikesTable data={bestPerformingPostsByLikes} />
                    <BestPerformingPostsByViewsTable data={bestPerformingPostsByLikes} /> */}

                    <BestPerformingPostsSection
                        bestPerformingPostsByLikes={bestPerformingPostsByLikes}
                        bestPerformingPostsByTotalReads={bestPerformingPostsByTotalReads}
                        bestPerformingPostsByBookmarks={bestPerformingPostsByBookmarks}
                    />
                </div>
            </section>


        </main>
    )
}

export default PrivateProfileAnalyticsDashboard