import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { GRAPHQL_URL } from "@/app/_config";

const httpLink = new UploadHttpLink({
  uri: GRAPHQL_URL,
  headers: {
    "x-apollo-operation-name": "UploadFile",
  },
  credentials: "include",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});
