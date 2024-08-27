'use client';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MoonIcon, SunIcon, PenIcon, Settings2, User, LogOut, Folder, SettingsIcon, SearchIcon, SaveIcon, SendIcon, UserIcon } from 'lucide-react';

import AllProviders from '@/utils/providers';
import { cn } from '@/lib/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseConfig';
import { getInitials } from '@/utils/strings';

import { Avatar, Button, ChattterLogo, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Tooltip } from '../ui';
import { UserContext } from '@/contexts';
import { useBooleanStateControl } from '@/hooks';
import SearchModal from './SearchModal';
import toast from 'react-hot-toast';
import AppHeader from './AppHeader';




const Body = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const { userData } = useContext(UserContext)
  const [theme, setTheme] = useState('light');
  const pathName = usePathname();
  const router = useRouter();
  const authPathNames = ['/login', '/register', '/onboarding', '/forgot-password', '/reset-password', '/complete-profile']



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

  const logout = () => {
    auth.signOut();
    router.push('/login')
  }





  return (
    <AllProviders>
      <div className={cn(theme === 'dark' ? 'dark' : 'light', "flex flex-col h-screen items-center justify-between font-display overflow-hidden")}>
        {
          !loading && user && userData && !authPathNames.includes(pathName) &&
          (
            <AppHeader
              theme={theme}
              toggleTheme={toggleTheme}
              user={user}
              logout={logout}
            />
          )
        }
        {
          !loading && !user && !authPathNames.includes(pathName) && pathName !== "/" &&
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
        }
        {children}
      </div>
    </AllProviders>
  );
};

export default Body;
