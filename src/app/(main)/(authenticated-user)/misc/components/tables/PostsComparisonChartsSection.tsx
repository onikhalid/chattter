import React from 'react'
import BestPerformingPostsByLikesTable from './BestPerformingPostsByLikesTable'
import { TPost } from '../../types'
import { Button, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils'
import BestPerformingPostsByBookmarksTable from './BestPerformingPostsByBookmarksTable'

interface BestPerformingPostsSectionProps {
    bestPerformingPostsByLikes: TPost[],
    // worsePerformingPostsByLikes: TPost[],
    bestPerformingPostsByTotalReads: TPost[],
    bestPerformingPostsByBookmarks: TPost[]
}
const BestPerformingPostsSection: React.FC<BestPerformingPostsSectionProps> = ({ bestPerformingPostsByLikes, bestPerformingPostsByTotalReads, bestPerformingPostsByBookmarks }) => {
    const [currentView, setCurrentView] = React.useState('likes')
    const tabsArray = [
        {
            label: 'By Likes',
            id: 'likes',
            component: <BestPerformingPostsByLikesTable
                data={bestPerformingPostsByLikes}
            />,
        },
        {
            label: "Reads/Views",
            id: 'views',
            component: <BestPerformingPostsByLikesTable
                data={bestPerformingPostsByTotalReads}
            />,
        },
        {
            label: "Bookmarks",
            id: 'bookmarks',
            component: <BestPerformingPostsByBookmarksTable
                data={bestPerformingPostsByBookmarks}
            />,
        }


    ]



    return (
        <Tabs value={currentView} className='relative flex flex-col w-full max-w-[1200px] mx-auto'>
            <TabsList className={"sticky top-0 flex w-full justify-start gap-4 rounded-10 bg-background px-0 pb-1 h-max z-[3] shadow-sm max-md:overflow-x-scroll"}>
                <div className="w-full px-1.5 md:px-6 pt-4 flex items-center justify-start border-muted-foreground/40 dark:border-muted border-b-2 max-md:justify-start">
                    {
                        tabsArray.map((tab, index) => {
                            return (
                                <TabsTrigger
                                    className={cn(
                                        'relative w-fit rounded-none !p-0 text-muted border-0 !bg-none outline-none !shadow-none transition-all sm:w-auto hover:!border-b-primary/30 bg-background',
                                        'group/trigger w-max text-sm',
                                        'data-[state=active]:text-muted-foreground',
                                    )}
                                    key={index}
                                    value={`${tab.id}`}
                                >
                                    <Button
                                        className={cn("bg-transparent text-sm font-semibold text-inherit py-1.5 w-full",
                                            currentView === tab.id ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                        variant='unstyled'
                                        onClick={() => setCurrentView(tab.id)}
                                    >
                                        {' '}
                                        {tab.label}
                                    </Button>
                                    <div className={
                                        cn(
                                            "absolute -bottom-[2px] left-0 w-full h-[2px] bg-primary opacity-0",
                                            "group-hover/trigger:opacity-30",
                                            currentView === tab.id && "!opacity-100"
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
    )
}

export default BestPerformingPostsSection