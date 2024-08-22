import React, { useEffect } from 'react'
import Link from 'next/link'

import { Badge } from '@/components/ui'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/utils/firebaseConfig'

import { UseGetTopHomeSidebar } from '../api'



const TopVoices = () => {
    const { data } = UseGetTopHomeSidebar()
    const [topInterests, setTopInterests] = React.useState<{ interest: string, count: number }[]>([])

    useEffect(() => {
        async function getTopInterests() {
            const userDocsSnapshot = await getDocs(collection(db, "users"))
            const interestCount: { [key: string]: number } = {};

            userDocsSnapshot.forEach((doc) => {
                const interests = doc.data().interests;

                if (interests) {

                    interests?.forEach((interest: string) => {
                        if (interestCount[interest]) {
                            interestCount[interest]++;
                        } else {
                            interestCount[interest] = 1;
                        }
                    });
                }
            });

            const sortedInterests = Object.entries(interestCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10).map(([interest, count]) => { return { interest, count } });
            return sortedInterests;
        }

        getTopInterests().then(setTopInterests)
    }, [])

    return (

        <div>
            <h3 className='text-lg mb-4'>Top Interests</h3>
            <div className='flex items-center flex-wrap gap-2'>
                {
                    topInterests?.map((interestdetail, index) => {
                        const { interest, count } = interestdetail
                        return (
                            <Link key={index} href={`/tags/${interest}`}>
                                <Badge variant='secondary' className='text-[0.78rem] font-normal'>
                                    {interest}
                                    <span className='pl-5'> {count}</span>
                                </Badge>
                            </Link>

                        )
                    })
                }
            </div>

            <h3 className='text-lg mt-10 mb-2'>Top Posts</h3>
            <div className='flex flex-col gap-4 divide-y divide-muted-foreground '>
                {
                    data?.topPosts.slice(0, 8)?.map((post, index) => {
                        return (
                            <div key={index}>
                                <Link href={`/p/${post.post_id}`}>
                                    <span className='2-[lh] text-[0.8rem]'>{post.title}</span>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}

export default TopVoices