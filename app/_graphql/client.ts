import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { GRAPHQL_URL, WS_GRAPHQL_URL } from "@/app/_config";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new UploadHttpLink({
  uri: GRAPHQL_URL,
  headers: {
    "x-apollo-operation-name": "UploadFile",
  },
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_GRAPHQL_URL,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});
