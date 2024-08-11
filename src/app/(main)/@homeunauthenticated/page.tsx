'use client';

import React, { useEffect, useState } from 'react'
import { ChattterLogo, LinkButton } from '@/components/ui'
import { MoonIcon, SunIcon } from 'lucide-react';

const UnAuthenticatedUserHomePage = () => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        const updatedTheme = theme === "light" ? 'dark' : 'light';
        setTheme(updatedTheme);
        localStorage.setItem("theme", updatedTheme);
    };




    return (
        <main className="flex h-screen w-screen flex-col items-center justify-between font-display">
            <header className="sticky top-0 flex items-center justify-between w-full p-5 md:px-10 md:py-6">
                <ChattterLogo />
                <section className='flex items-center gap-4'>
                    <div onClick={toggleTheme} className='cursor-pointer'>
                        {
                            theme == 'dark'
                                ?
                                <SunIcon size={24} strokeWidth={1.5} />
                                :
                                <MoonIcon size={24} strokeWidth={1.5} />
                        }
                    </div>
                    <LinkButton href='/login' data-testid="login-button-link">
                        Login
                    </LinkButton>
                    <LinkButton href="/register" data-testid="signup-button">
                        Get Started
                    </LinkButton>

                </section>
            </header>

            <div className="flex flex-col justify-center gap-2 w-full max-w-5xl text-sm grow max-md:px-5 md:max-lg:px-[7.5vw]">
                <div onClick={toggleTheme} className='cursor-pointer'>
                    {
                        theme == 'dark'
                            ?
                            <SunIcon size={24} strokeWidth={1.5} />
                            :
                            <MoonIcon size={24} strokeWidth={1.5} />
                    }
                </div>
                <span>Welcome to Chattter,</span>
                <h1 className="text-[3rem] md:text-[4rem] lg:text-[6rem] font-semibold leading-[1] max-w-[12ch]" data-testid="hero-text">
                    A traditional bookworm&apos;s heaven.
                </h1>
                <span className="text-base">A multi-functional platform for authors and readers to create and access content.</span>
                <LinkButton className="max-w-max px-10 md:px-12 py-5 md:py-6 text-base mt-8 md:mt-12" href="/register">
                    Get Started
                </LinkButton>
            </div>

            <footer className="sticky bottom-0 flex items-center justify-between bg-black dark:bg-foreground dark:text-primary-foreground text-background w-full p-4 max-md:text-xs">
                <small>&copy; 2024 Chattter. All rights reserved</small>
                <span>
                    Built with ❤️ by
                    <a href="https://github.com/onikhalid" target="_blank" className="ml-1.5 underline decoration-white dark:decoration-primary-foreground hover:decoration-primary">
                        Khalid.
                    </a>
                </span>
            </footer>
        </main>
    )
}

export default UnAuthenticatedUserHomePage