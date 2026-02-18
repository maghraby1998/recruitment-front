import { gql } from "@apollo/client";

export const GET_AUTH_USER = gql`
  query getAuthUser {
    getAuthUser {
      id
      email
      employee {
        firstName
        lastName
        imgPath
        position {
          id
          title
        }
      }
      company {
        name
        imgPath
      }
    }
  }
`;

export const GET_MY_JOB_POSTS = gql`
  query GetMyPostJobs($pagination: PaginationInput) {
    myJobPosts(pagination: $pagination) {
      data {
        id
        title
        description
        status
        applicationsNumber
      }
      meta {
        totalItems
        totalPages
        currentPage
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_JOB_POSTS = gql`
  query GetJobPosts($pagination: PaginationInput) {
    jobPosts(pagination: $pagination) {
      data {
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
        canApply
        skills {
          id
          name
        }
      }
      meta {
        totalItems
        totalPages
        currentPage
        limit
        hasNextPage
        hasPreviousPage
      }
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
  query GetJobPostApplications($jobPostId: ID!, $pagination: PaginationInput) {
    getJobPostApplications(jobPostId: $jobPostId, pagination: $pagination) {
      data {
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
      meta {
        totalItems
        totalPages
        currentPage
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_MY_APPLICATIONS = gql`
  query GetMyApplications($pagination: PaginationInput) {
    getMyApplications(pagination: $pagination) {
      data {
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
      meta {
        totalItems
        totalPages
        currentPage
        limit
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_APPLICATION_ANSWERS_DETAILS = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      jobPost {
        id
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

export const GET_MY_SKILLS = gql`
  query GetMySkills {
    getMySkills {
      id
      name
    }
  }
`;

export const GET_ALL_SKILLS = gql`
  query GetAllSkills($search: String) {
    skills(search: $search) {
      id
      name
    }
  }
`;

export const GET_POSITIONS = gql`
  query GetPositions($name: String) {
    positions(name: $name) {
      id
      title
    }
  }
`;
