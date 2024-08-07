'use client'

import React, { useContext, useEffect, useState } from 'react'
import AllProviders from '@/utils/providers'
import { Space_Grotesk } from "next/font/google";
import { cn } from '@/lib/utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/utils/firebaseConfig';
import { Avatar, Button, ChatterLogo, LinkButton, Popover, PopoverContent, PopoverTrigger } from '../ui';
import { MoonIcon, SunIcon, PenIcon } from 'lucide-react';
import { getInitials } from '@/utils/strings';
import { } from '../icons';
import { usePathname, useSearchParams } from 'next/navigation';

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});
// export const sans = localFont({
//   src: 'fonts/ClashDisplay-Variable.ttf',
//   display: 'swap',
//   variable: '--font-sans',
// });


const Body = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const updatedTheme = theme === "light" ? 'dark' : 'light';
    setTheme(updatedTheme);
    localStorage.setItem("theme", updatedTheme);
  };
  const params = useSearchParams()
  const pathName = usePathname()
  const postToEditId = params.get('edit');






  return (
    <AllProviders>
      <body className={cn(displayFont.variable, theme === 'dark' ? 'dark' : 'light', "flex flex-col h-screen items-center justify-between font-display overflow-hidden")}>
        {
          !loading && user &&
          <header className="sticky top-0 flex items-center justify-between w-full px-5 py-3 md:px-10 md:py-4 border-b-[0.3px] border-b-[#E4E7EC] font-display">
            <ChatterLogo />
            <section className='flex items-center gap-4'>
              {
                pathName === '/new' &&
                <Button shape='rounded' className='flex items-center gap-2 rounded-lg py-1.5' type='submit' form="form">
                  {
                    postToEditId ?
                      "Update"
                      :
                      "Submit"
                  }
                  <PenIcon color={'lightblue'} size={15} />
                </Button>
              }

              {
                pathName !== '/new' &&
                <LinkButton href='/new' shape='rounded' variant='outline' className='flex items-center gap-2 rounded-lg border-[#b6b5b5] py-1.5'>
                  Write story <PenIcon size={15} />
                </LinkButton>
              }

              <div onClick={toggleTheme} className='cursor-pointer'>
                {
                  theme == 'dark' ?
                    <SunIcon size={24} strokeWidth={1.5} />
                    :
                    <MoonIcon size={24} strokeWidth={1.5} />
                }
              </div>

              <Popover>
                <PopoverTrigger>
                  <Avatar alt='' fallback={getInitials(user?.displayName! || "")} src={user?.photoURL} />
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <span className="text-sm">Signed in as</span>
                    <h6 className="font-semibold">{user?.displayName}</h6>
                  </div>
                </PopoverContent>
              </Popover>
            </section>
          </header>
        }
        {children}
      </body>
    </AllProviders>
  )
}

export default Body