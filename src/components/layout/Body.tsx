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

import { Avatar, Button, ChattterLogo, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, LinkButton, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Tooltip } from '../ui';
import { UserContext } from '@/contexts';
import { useBooleanStateControl } from '@/hooks';
import SearchModal from './SearchModal';




const Body = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const { userData } = useContext(UserContext)
  const [theme, setTheme] = useState('light');
  const params = useSearchParams();
  const pathName = usePathname();
  const postToEditId = params.get('edit');
  const router = useRouter();
  const authPathNames = ['/login', '/register', '/onboarding', '/forgot-password', '/reset-password', '/complete-profile']

  const {
    state: isSearchModalOpen,
    setTrue: openSearchModal,
    setFalse: closeSearchModal
  } = useBooleanStateControl()
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
            <header className="sticky top-0 flex items-center justify-between w-full px-5 py-3 md:px-10 md:py-4 border-b-[0.6px] border-muted-foreground dark:border-b-muted font-display">
              <ChattterLogo />
              <section className='flex items-center gap-4 md:gap-4'>
                <Tooltip content='Search'>
                  <SearchIcon onClick={openSearchModal} size={24} className='cursor-pointer' />
                </Tooltip>

                <Tooltip content={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                  <div onClick={toggleTheme} className='cursor-pointer'>

                    {
                      theme == 'dark'
                        ?
                        <SunIcon size={26} strokeWidth={1.8} />
                        :
                        <MoonIcon size={24} strokeWidth={1.8} />
                    }
                  </div>
                </Tooltip>

                {
                  pathName === '/new' &&
                  <Button shape='rounded' variant="secondary" className='flex items-center gap-2 rounded-lg py-1.5' type='submit' form="form">
                    <span className='max-md:hidden'>
                      {postToEditId ? "Update" : "Submit"}
                    </span>
                    {
                      postToEditId ?
                        <SaveIcon size={15} />
                        :
                        <SendIcon size={15} />
                    }
                  </Button>
                }
                {
                  pathName !== '/new' &&
                  <LinkButton href='/new' shape='rounded' variant='default' className='flex items-center gap-2 rounded-lg border-muted max-md:!p-0 md:py-1.5 max-md:!bg-transparent'>
                    <span className='max-md:hidden'>
                      Write story
                    </span>
                    <PenIcon size={15} className='max-md:size-[18px] max-md:text-foreground' />
                  </LinkButton>

                }


                <Sheet>
                  <SheetTrigger className='md:hidden' data-testid="menu-button">
                    <Avatar alt={user.displayName || "user"} src={user.photoURL || userData?.avatar} fallback={getInitials(user.displayName || "F N")} size='large' />
                  </SheetTrigger>

                  <SheetContent className='flex flex-col items-center justify-between py-[10vh]'>
                    <SheetHeader>
                    </SheetHeader>

                    <div className='flex flex-col'>
                      <Link href={`/me`} className='flex items-center gap-2 text-base px-3 py-4 rounded-none w-full mb-3'>
                        <Avatar alt={user.displayName || "user"} src={user.photoURL || userData?.avatar} fallback={getInitials(user.displayName || "F N")} className='w-14 h-14' />
                        <div>
                          <p className='text-xl font-display max-w-[20ch]'>{user.displayName}</p>
                          <p className='text-muted-foreground text-sm'>{user.email}</p>
                        </div>
                      </Link>

                      <Link href='/me' className='flex items-center gap-2 text-xl pl-3 rounded-none w-full py-3.5'>
                        <UserIcon size={25} />
                        Profile
                      </Link>

                      <Link href='/bookmarks' className='flex items-center gap-2 text-xl pl-3 rounded-none w-full py-3.5'>
                        <Folder size={25} />
                        Bookmarks
                      </Link>
                      <Link href='/settings' className='flex items-center gap-2 text-xl pl-3 rounded-none w-full py-3.5'>
                        <SettingsIcon size={25} />
                        Settings
                      </Link>
                    </div>

                    <SheetFooter className='flex flex-col gap-4 w-full'>
                      <LinkButton href='/new' variant='default' className='flex items-center gap-2 border-muted py-6'>
                        Write
                        <PenIcon size={18} />
                      </LinkButton>
                      <Button variant="destructive" onClick={logout} className='flex items-center gap-2 py-6 w-full'>
                        <LogOut size={16} className='dark:text-red-400 text-white' />
                        Logout
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>


                <DropdownMenu>
                  <DropdownMenuTrigger className='ml-auto max-md:hidden' data-testid="menu-button">
                    <Avatar alt={user.displayName || "user"} src={user.photoURL || userData?.avatar} fallback={getInitials(user.displayName || "F N")} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='flex flex-col gap-0.5 px-0'>

                    <DropdownMenuItem className='px-3 w-72 dark:border-b-muted border-b-muted-foreground border-b rounded-none'>
                      <Link href={`/me/profile`} className='flex items-center gap-2 text-base px-3 py-4 rounded-none w-full'>
                        <Avatar alt={user.displayName || "user"} src={user.photoURL || userData?.avatar} fallback={getInitials(user.displayName || "F N")} className='w-14 h-14' />
                        <div>
                          <p className='text-xl font-display max-w-[20ch]'>{user.displayName}</p>
                          <p className='text-muted-foreground text-sm'>{user.email}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='!rounded-none'>
                      <Link href='/bookmarks' className='flex items-center gap-2 text-lg pl-3 rounded-none w-full py-3'>
                        <Folder size={24} />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='!rounded-none'>
                      <Link href='/settings' className='flex items-center gap-2 text-lg pl-3 rounded-none w-full py-3'>
                        <SettingsIcon size={24} />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className=' !rounded-none'>
                      <button onClick={logout} className='flex items-center gap-2 text-lg pl-3 rounded-none w-full py-3 text-red-400' data-testid="logout-button">
                        <LogOut size={24} className='text-red-400' />
                        Logout
                      </button>
                    </DropdownMenuItem>


                    <div className='py-2 mt-4'>
                      <p className='text-muted-foreground text-sm text-center'>Chattter v1.0.0</p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>

              <SearchModal
                isModalOpen={isSearchModalOpen}
                closeModal={closeSearchModal}
              />

            </header>
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
