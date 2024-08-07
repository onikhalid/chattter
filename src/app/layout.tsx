import type { Metadata } from "next";

import { Body } from "@/components/layout";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import React, { Suspense } from "react";


export const metadata: Metadata = {
  title: "Chatter",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
  authenticated,
  unauthenticated
}: Readonly<{
  children: React.ReactNode;
  authenticated: React.ReactNode
  unauthenticated: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description!} />
        {/* <title>{metadata.title}</title> */}
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="stylesheet" href={inter.href} /> */}
      </head>
      <Suspense fallback={<div>Loading...</div>}>
        <Body >
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
        </Body>
      </Suspense>

    </html>
  );
}
