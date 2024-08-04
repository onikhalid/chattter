// apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'https://khalid-chatter.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET || "",
  },
  cache: new InMemoryCache(),
});

export default apolloClient;
