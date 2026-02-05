import { ApolloClient, InMemoryCache } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

const httpLink = new UploadHttpLink({
  uri: "http://localhost:5000/graphql",
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
