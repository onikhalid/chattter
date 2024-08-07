'use client'


import React from 'react'
import { Spinner } from "@/components/icons";
import { AuthenticatedHomepage, UnauthenticatedHomepage } from "@/components/layout";
import { Button, ChatterLogo } from "@/components/ui";
import { LinkButton } from "@/components/ui/linkButton";
import { auth } from "@/utils/firebaseConfig";
import Image from "next/image";
import { useAuthState } from 'react-firebase-hooks/auth';
interface Props {
    authenticated: React.ReactNode
    unauthenticated: React.ReactNode

}
const LandingPage: React.FC<Props> = ({ authenticated, unauthenticated }) => {

    const [user, loading] = useAuthState(auth);

    return (
        <>
            {
                loading ?
                    <div className="flex items-center justify-center w-screen h-screen ">
                        <Spinner color='#385af5' />
                    </div>
                    :
                    user ?
                        authenticated
                        :
                        unauthenticated
            }
        </>
    )
}

export default LandingPage