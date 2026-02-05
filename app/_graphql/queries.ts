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

export const GET_MY_JOB_POSTS = gql`
  query GetMyPostJobs {
    myJobPosts {
      id
      title
      description
      status
    }
  }
`;

export const GET_JOB_POSTS = gql`
  query GetJobPosts {
    jobPosts {
      id
      title
      description
      status
      company {
        name
        imgPath
      }
    }
  }
`;
