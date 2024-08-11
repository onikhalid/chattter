import { Avatar, Badge, Button } from '@/components/ui'
import { TUser, UserContext } from '@/contexts'
import { auth } from '@/utils/firebaseConfig'
import Link from 'next/link'
import React, { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import toast from 'react-hot-toast'
import { UseFollowUser, UseUnFollowUser } from '../api'
import { SmallSpinner } from '@/components/icons'

interface Props {
    user: TUser
}
const UserCard = ({ user }: Props) => {
    const { userFollows } = useContext(UserContext)
    const [currentUser, loading] = useAuthState(auth)
    const { username, name, avatar, interests } = user
    const { mutate: followUser, isPending: isFollowingUser } = UseFollowUser()
    const { mutate: unfollowUser, isPending: isUnfollowingUser } = UseUnFollowUser()

    const followUnfollow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      
        e.stopPropagation()
        e.preventDefault()


        if (!loading && !currentUser) {
            toast.error("Login to follow users")
        } else if (currentUser) {
            const data = {
                follower_id: currentUser?.uid || '',
                followed_id: user.uid
            }
            if (userFollows?.includes(user.uid)) {
                unfollowUser(data)
                toast.success(`Unfollowed ${user.name}`)
            } else {
                followUser(data)
                toast.success(`Followed ${user.name}`)
            }
        }
    }


    return (
        <Link href={`/u/${username}`} className='flex max-sm:flex-col items-center justify-between gap-2 py-5 px-2 xl:px-4 hover:bg-secondary/50' passHref>
            <section className='flex items-center gap-2.5 max-sm:self-start'>
                <Avatar alt={username} src={avatar} fallback={name || "FIRST NAME"} size="large" className="w-16 h-16" />
                <div>
                    <h6 className='text-lg'>{name}</h6>
                    <p className='text-muted-foreground text-sm'>@{username}</p>
                </div>
            </section>

            {
                interests && interests.length > 0 && (
                    <div className='flex gap-2 flex-wrap max-w-sm'>
                        {interests.slice(0, 8).map((interest) => (
                            <Badge key={interest} variant='outline' className='text-xs font-normal'>
                                <Link href={`/tags/${interest}`}>{interest}</Link>
                            </Badge>
                        ))}
                        {
                            interests.length > 8 && (
                                <Badge variant='outline' className='text-xs font-normal'>+{interests.length - 8} more</Badge>
                            )
                        }
                    </div>
                )
            }

            <Button onClick={(e) => followUnfollow(e)} className='flex items-center gap-2.5 w-full text-[1rem] max-md:text-base max-sm:mt-4 md:max-w-max'
                variant={userFollows?.includes(user.uid || "") ? "secondary" : "default"}
            >
                {
                    isUnfollowingUser || isFollowingUser ?
                        <SmallSpinner className='text-primary' />
                        :
                        userFollows?.includes(user.uid || "") ?
                            isUnfollowingUser ? "Unfollowing" : "Following"
                            :
                            isFollowingUser ? "Following" : "Follow"
                }

            </Button>
        </Link>
    )
}

export default UserCard