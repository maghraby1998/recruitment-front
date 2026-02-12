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
      applicationsNumber
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
      applicationsNumber
      created_at
    }
  }
`;

export const GET_JOB_POST_DETAILS = gql`
  query GetJobPostDetails($id: ID!) {
    jobPost(id: $id) {
      title
      description
      company {
        name
        imgPath
      }
      form {
        id
        requireCV
        questions {
          id
          label
          isRequired
          type
          options {
            id
            value
          }
        }
      }
    }
  }
`;

export const GET_JOB_POST_APPLICATIONS = gql`
  query GetJobPostApplications($jobPostId: ID!) {
    getJobPostApplications(jobPostId: $jobPostId) {
      id
      jobPost {
        title
      }
      employee {
        firstName
        lastName
        imgPath
        user {
          email
        }
      }
      status
    }
  }
`;

export const GET_MY_APPLICATIONS = gql`
  query GetJobPostApplications {
    getMyApplications {
      id
      jobPost {
        title
        company {
          name
          imgPath
        }
      }
      status
    }
  }
`;

export const GET_APPLICATION_ANSWERS_DETAILS = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      jobPost {
        title
        company {
          name
          imgPath
        }
        form {
          id
          requireCV
          questions {
            id
            label
            isRequired
            type
            options {
              id
              value
            }
          }
        }
      }
      employee {
        firstName
        lastName
        imgPath
      }
      CVFilePath
      answers {
        id
        value
        questionId
      }
      status
    }
  }
`;
