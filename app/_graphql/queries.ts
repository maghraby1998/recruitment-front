import { gql } from "@apollo/client";

export const GET_AUTH_USER = gql`
  query getAuthUser {
    getAuthUser {
      id
      email
      employee {
        firstName
        lastName
      }
      company {
        name
      }
    }
  }
`;
