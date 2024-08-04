import React from 'react'
import { AuthProvider } from "@/contexts/userAuthContext";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/utils/apolloClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, UserProvider } from '@/contexts/UserInfoContext';

const queryClient = new QueryClient();


const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <ApolloProvider client={apolloClient}>
              {children}
            </ApolloProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default AllProviders