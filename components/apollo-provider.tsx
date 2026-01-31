"use client";

import { client } from "@/app/_graphql/client";
import { ApolloProvider } from "@apollo/client/react";

export const ApolloProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
