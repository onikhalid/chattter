'use client'


import React from 'react'
import { Spinner } from "@/components/icons";
import { Button, ChatterLogo } from "@/components/ui";
import { LinkButton } from "@/components/ui/linkButton";
import { auth } from "@/utils/firebaseConfig";
import Image from "next/image";
import { useAuthState } from 'react-firebase-hooks/auth';
import { usePathname } from 'next/navigation';
interface Props {
    children: React.ReactNode
    homeauthenticated: React.ReactNode
    homeunauthenticated: React.ReactNode

}
const MainLayout: React.FC<Props> = ({ children, homeauthenticated, homeunauthenticated }) => {

    const [user, loading] = useAuthState(auth);
    const pathName = usePathname()
    return (
        <>
            {children}
            {
                pathName === '/' &&
                <>
                    {
                        loading ?
                            <div className="flex items-center justify-center w-screen h-screen ">
                                <Spinner color='#385af5' />
                            </div>
                            :
                            user ?
                            homeauthenticated
                                :
                                homeunauthenticated
                    }
                </>
            }

        </>
    )
}

export default MainLayout