'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Link, ArrowLeftSquare } from 'lucide-react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { ChattterLogo } from '@/components/ui'
import { getInitials } from '@/utils/strings'
import { Avatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui'
import { auth } from '@/utils/firebaseConfig'

const AuthLayoutHeader = () => {
    const [user, loading] = useAuthState(auth)
    const router = useRouter();
    const logout = () => {
      auth.signOut();
      router.push('/login')
    }

    return (
        <header className="sticky top-0 flex items-center justify-between w-full p-5 md:px-10 md:py-6">
            <ChattterLogo />

            {
                !loading && user &&
                <DropdownMenu>
                    <DropdownMenuTrigger className='ml-auto'>
                        <Avatar alt={user?.displayName || "user"} src={user?.photoURL} fallback={getInitials(user.displayName || "F N")} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>

                        <DropdownMenuItem className='flex items-center gap-2'>
                            <ArrowLeftSquare size={15} />
                            <button onClick={logout}>Logout</button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </header>
    )
}

export default AuthLayoutHeader