import "./globals.css";

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import dynamic from 'next/dynamic';
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Chattter",
  description: "A heaven for traditionla book lovers",
};

const DynamicBody = dynamic(() => import('@/components/layout/Body'), {
  ssr: false,
});
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description!} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={displayFont.variable}>
        <DynamicBody>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              error: {
                style: {
                  background: 'red',
                  color: 'white',
                },
              },
            }}
          />
        </DynamicBody>
      </body>
    </html>
  );
}
