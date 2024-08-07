import React from 'react'
import { ChatterLogo, LinkButton } from '@/components/ui'

const UnAuthenticatedUserHomePage = () => {
    return (
        <main className="flex h-screen flex-col items-center justify-between font-display">
            <header className="sticky top-0 flex items-center justify-between w-full p-5 md:px-10 md:py-6">
                <ChatterLogo />
                <section className='flex items-center'>
                    <LinkButton href='/login'>
                        Login
                    </LinkButton>
                    <LinkButton href="/register">
                        Get Started
                    </LinkButton>

                </section>
            </header>

            <div className="flex flex-col justify-center gap-2 w-full max-w-5xl text-sm grow max-md:px-5 md:max-lg:px-[7.5vw]">
                <span>Welcome to Chatter,</span>
                <h1 className="text-[3rem] md:text-[4rem] lg:text-[6rem] font-semibold leading-[1] max-w-[12ch]">
                    A traditional bookworm&apos;s heaven.
                </h1>
                <span className="text-base">A multi-functional platform for authors and readers to create and access content.</span>
                <LinkButton className="max-w-max px-10 md:px-12 py-5 md:py-6 text-base mt-8 md:mt-12" href="/register">
                    Get Started
                </LinkButton>
            </div>

            <footer className="sticky bottom-0 flex items-center justify-between bg-black text-background w-full p-4 max-md:text-xs">
                <small>&copy; 2024 Chatter. All rights reserved</small>
                <span>
                    Built with ❤️ by
                    <a href="https://github.com/onikhalid" target="_blank" className="ml-1.5 underline decoration-white hover:decoration-primary">
                        Khalid.
                    </a>
                </span>
            </footer>
        </main>
    )
}

export default UnAuthenticatedUserHomePage