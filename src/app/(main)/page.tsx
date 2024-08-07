'use client'


import React from 'react'
import { Spinner } from "@/components/icons";
import { AuthenticatedHomepage, UnauthenticatedHomepage } from "@/components/layout";
import { Button, ChatterLogo } from "@/components/ui";
import { LinkButton } from "@/components/ui/linkButton";
import { auth } from "@/utils/firebaseConfig";
import Image from "next/image";
import { useAuthState } from 'react-firebase-hooks/auth';


const LandingPage = () => {

    const [user, loading] = useAuthState(auth);

    return (
        <>
           
        </>
    )
}

export default LandingPage