import { gql } from "@apollo/client";

export const REGISTER_EMPLOYEE = gql`
  mutation RegisterEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      firstName
      lastName
      user {
        email
      }
    }
  }
`;

export const REGISTER_COMPANY = gql`
  mutation RegisterCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      user {
        email
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logOut
  }
`;

export const LOGIN = gql`
  mutation Login($input: SignInInput!) {
    signIn(input: $input) {
      id
      userType
    }
  }
`;
