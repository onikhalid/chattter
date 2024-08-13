import React from 'react'
import Link from 'next/link'

import { FacebookIcon2, InstagramIcon, LinkedInIcon, TwitterIcon } from '@/components/icons'
import { Avatar, Badge, Button, LinkButton, Tooltip } from '@/components/ui'
import { TUser } from '@/contexts'

interface Props {
    userData: TUser | null | undefined
    userFollowers: string[]
    userFollows: string[]
    userInterests: string[]
    openEditProfileModal: () => void
}
const UserProfileDetailsArticle: React.FC<Props> = ({ userData, userFollowers, userFollows, userInterests, openEditProfileModal }) => {
    return (
        <>
            {
                userData &&
                <article className='flex flex-col gap-4 items-center text-center py-10 my-auto'>
                    <div>
                        <Avatar
                            src={userData.avatar}
                            alt={userData.username}
                            fallback={userData.name!}
                            className='rounded-full h-28 w-28 md:w-36 md:h-36 '
                            fallbackClass='text-2xl'
                        />
                    </div>

                    <div className='pt-2 pb-1'>
                        <h2 className='text-xl font-medium m-0'>
                            {userData.name}
                        </h2>
                        <span className='text-muted-foreground text-sm italic'>
                            @{userData.username}
                        </span>
                    </div>

                    <Button className='w-full max-w-[200px] my-2' onClick={openEditProfileModal} variant={'default'}>
                        Edit profile
                    </Button>


                    <div className='flex items-center gap-4'>
                        <p className='flex flex-col text-2xl font-semibold'>
                            {userFollowers?.length || 0}
                            <span className='text-sm text-muted-foreground'>
                                Followers
                            </span>
                        </p>
                        <p className='flex flex-col text-2xl font-semibold'>
                            {userFollows?.length || 0}
                            <span className='text-sm text-muted-foreground'>
                                Following
                            </span>
                        </p>
                    </div>

                    <section>
                        <p className='text-sm text-foreground py-2.5'>
                            {userData.bio}
                        </p>
                    </section>



                    {
                        userInterests && userInterests.length > 0 &&
                        <div className='flex items-center justify-center flex-wrap gap-2'>
                            {
                                userInterests.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className='text-sm font-normal'>
                                        <Link href={`/tags/${tag.toLowerCase()}`}>
                                            {tag}
                                        </Link>
                                    </Badge>
                                ))
                            }
                        </div>
                    }


                    <footer className='flex flex-col gap-3 '>
                        <p className='text-muted-foreground text-sm mt-4'>
                            Member since {userData.created_at.toDate().toLocaleDateString()}
                        </p>

                        <div className='flex items-center gap-5 justify-center w-full'>
                            {
                                userData.facebook && userData.facebook.trim() !== "" ? (
                                    <LinkButton href={userData.facebook} variant='unstyled'>
                                        <FacebookIcon2 className='text-foreground' />
                                    </LinkButton>
                                ) : (
                                    <Tooltip content='Instagram link not set'>
                                        <div className='opacity-50 cursor-not-allowed'>
                                            <FacebookIcon2 className='text-foreground' />
                                        </div>
                                    </Tooltip>
                                )
                            }
                            {
                                userData.instagram && userData.instagram.trim() !== "" ? (
                                    <LinkButton href={userData.instagram} variant='unstyled'>
                                        <InstagramIcon className='text-foreground' />
                                    </LinkButton>
                                ) : (
                                    <Tooltip content='Instagram link not set'>
                                        <div className='opacity-50 cursor-not-allowed'>
                                            <InstagramIcon className='text-foreground' />
                                        </div>
                                    </Tooltip>
                                )
                            }
                            {
                                userData.linkedin && userData.linkedin.trim() !== "" ? (
                                    <LinkButton href={userData.linkedin} variant='unstyled'>
                                        <LinkedInIcon />
                                    </LinkButton>
                                ) : (
                                    <Tooltip content='Linkedin link not set'>
                                        <div className='opacity-50 cursor-not-allowed'>
                                            <LinkedInIcon />
                                        </div>
                                    </Tooltip>
                                )
                            }
                            {
                                userData.twitter && userData.twitter.trim() !== "" ? (
                                    <LinkButton href={userData.twitter} variant='unstyled'>
                                        <TwitterIcon />
                                    </LinkButton>
                                ) : (
                                    <Tooltip content='Twittwr/X link not set'>
                                        <div className='opacity-50 cursor-not-allowed'>
                                            <TwitterIcon />
                                        </div>
                                    </Tooltip>
                                )
                            }
                        </div>
                    </footer>
                </article>
            }
        </>

    )
}

export default UserProfileDetailsArticle