'use client'

import React, { useContext } from 'react'
import AllProviders from '@/utils/providers'
import { Space_Grotesk } from "next/font/google";
import { cn } from '@/lib/utils';
import { ThemeContext } from '@/contexts/UserInfoContext';

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
  const {theme} = useContext(ThemeContext)
  return (
    <AllProviders>
      <body className={cn(displayFont.variable, theme == 'dark' ? 'dark' : 'light')}>
        {children}
        </body>
    </AllProviders>
  )
}

export default Body