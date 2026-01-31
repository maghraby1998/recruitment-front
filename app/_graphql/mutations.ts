import { gql } from "@apollo/client";

export const REGISTER_EMPLOYEE = gql`
  mutation RegisterEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logOut
  }
`;
