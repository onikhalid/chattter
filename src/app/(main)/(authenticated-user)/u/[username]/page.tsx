'use client'
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Avatar, Badge, Button, LinkButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { cn } from '@/lib/utils';
import { SmallSpinner } from '@/components/icons';
import { auth } from '@/utils/firebaseConfig';
import { UserContext } from '@/contexts';

import { PublicProfileDetails, PublicProfilePosts } from '../../misc/components';
import { UseFollowUser, UseGetUserPublicProfileDetails, UseUnFollowUser } from '../../misc/api';
import Link from 'next/link';


const UserPublicProfilePage = ({ params }: { params: { username: string } }) => {
    const { username } = params
    const { userFollows } = useContext(UserContext)
    const { data, isLoading, refetch } = UseGetUserPublicProfileDetails(username)
    const [user, loading] = useAuthState(auth)

    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'posts';
    const tabsArray = [
        {
            label: "Posts",
            id: 'posts',
            component: <PublicProfilePosts username={username} />
        },
        {
            label: 'Archive',
            id: 'archive',
            component: <PublicProfileDetails />
        },
    ]
    const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()
    const followUnfollow = () => {
        if (!loading && !user) {
            toast.error("Login to follow users")
        } else if (user && data) {
            const dataToSubmit = {
                follower_id: user.uid || '',
                followed_id: data.details.uid
            }
            if (userFollows?.includes(data.details.uid)) {
                unfollowUser(dataToSubmit)
                toast.success(`Unfollowed ${data.details.name}`)
            } else {
                followUser(dataToSubmit)
                toast.success(`Followed ${data.details.name}`)
            }
            refetch()
        }
    }






    return (
        <main className="relative grow w-full flex flex-col-reverse lg:grid grid-cols-[1fr,0.4fr] px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            {
                isLoading ?

                    <div className='flex items-center justify-center w-full h-full col-span-2'>
                        <SmallSpinner className='w-10 h-10 animate-spin text-primary' />
                    </div>

                    :
                    <>
                        <Tabs value={view} className='relative flex flex-col w-full max-w-[1200px] mx-auto'>
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
                                (!isLoading && data) &&
                                <article className='flex flex-col items-center text-center py-10 my-auto'>
                                    <div>
                                        <Avatar
                                            src={data?.details.avatar}
                                            alt={data?.details.username}
                                            fallback={data?.details.name!}
                                            className='rounded-full h-28 w-28 '
                                            fallbackClass='text-2xl'
                                        />
                                    </div>

                                    <div className='pt-2 pb-1'>
                                        <h2 className='text-xl font-medium m-0'>
                                            {data?.details.name}
                                        </h2>
                                        <span className='text-muted-foreground text-sm italic'>
                                            @{data?.details.username}
                                        </span>
                                    </div>



                                    <div className='flex items-center gap-4'>
                                        <p className='flex flex-col text-2xl font-semibold'>
                                            {data?.followers?.length || 0}
                                            <span className='text-sm text-muted-foreground'>
                                                Followers
                                            </span>
                                        </p>
                                        <p className='flex flex-col text-2xl font-semibold'>
                                            {data?.following?.length || 0}
                                            <span className='text-sm text-muted-foreground'>
                                                Following
                                            </span>
                                        </p>
                                    </div>


                                    <Button className={cn('w-full max-w-[200px] mt-4', { "hidden": user?.uid === data.details.uid })} onClick={followUnfollow}
                                        variant={userFollows?.includes(data.details.uid) ? 'outline' : 'default'}
                                        disabled={isFollowingUser || isUnfollowingUser || user?.uid === data.details.uid}
                                    >
                                        {userFollows?.includes(data.details.uid) ? 'Unfollow' : 'Follow'}
                                    </Button>
                                    <LinkButton href="/me" className={cn("w-full max-w-[200px] mt-4", { "hidden": user?.uid !== data.details.uid } )}>
                                        View more details
                                    </LinkButton>

                                    <p className='text-sm text-foreground py-2.5'>
                                        {data?.details.bio}
                                    </p>



                                    {
                                        data?.details.interests && data?.details.interests.length > 0 &&
                                        <div className='flex items-center justify-center flex-wrap gap-2'>
                                            {
                                                data?.details.interests.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className='text-sm font-normal'>
                                                        <Link href={`/tags/${tag.toLowerCase()}`}>
                                                            {tag}
                                                        </Link>
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    }
                                </article>
                            }
                        </section>
                    </>
            }

        </main>
    )
}

export default UserPublicProfilePage