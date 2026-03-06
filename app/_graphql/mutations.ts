import { gql } from "@apollo/client";

export const REGISTER_EMPLOYEE = gql`
  mutation RegisterEmployee($input: CreateEmployeeInput!, $image: Upload) {
    createEmployee(input: $input, image: $image) {
      user {
        id
        email
        employee {
          firstName
          lastName
        }
      }
    }
  }
`;

export const REGISTER_COMPANY = gql`
  mutation RegisterCompany($input: CreateCompanyInput!, $image: Upload) {
    createCompany(input: $input, image: $image) {
      user {
        id
        email
        company {
          name
        }
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
      user_type
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

export const CREATE_JOB_POST = gql`
  mutation CreateJobPost($input: CreateJobPostInput) {
    createJobPost(input: $input) {
      id
    }
  }
`;

export const CREATE_JOB_APPLICATIONS = gql`
  mutation CreateJobApplication($input: ApplyForJobInput, $CVFilePdf: Upload) {
    applyForJob(input: $input, CVFilePdf: $CVFilePdf) {
      id
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($input: UpdateApplicationStatusInput) {
    updateApplicationStatus(input: $input) {
      id
    }
  }
`;

export const CREATE_EMPLOYEE_SKILL = gql`
  mutation CreateSkill($input: CreateSkillInput) {
    createSkill(input: $input) {
      id
    }
  }
`;

export const CHANGE_PROFILE_IMAGE = gql`
  mutation ChangeProfileImage($image: Upload!) {
    changeImage(image: $image) {
      id
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput, $images: [Upload]) {
    createPost(input: $input, images: $images) {
      id
      content
      type
      created_at
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
    }
  }
`;

export const CREATE_REACTION = gql`
  mutation CreateReaction($input: CreateReactionInput!) {
    createReact(input: $input) {
      id
      type
    }
  }
`;

export const DELETE_REACTION = gql`
  mutation DeleteReaction($postId: ID!) {
    deleteReaction(postId: $postId) {
      id
    }
  }
`;

export const CREATE_COMMENT_REACTION = gql`
  mutation CreateCommentReaction($input: CreateCommentReactionInput!) {
    createCommentReaction(input: $input) {
      id
      type
    }
  }
`;

export const DELETE_COMMENT_REACTION = gql`
  mutation DeleteCommentReaction($commentId: ID!) {
    deleteCommentReaction(commentId: $commentId) {
      id
    }
  }
`;

export const CREATE_EXPERIENCE = gql`
  mutation CreateExperience($input: UpsertExperienceInput) {
    createExperience(input: $input) {
      id
    }
  }
`;

export const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: ID!) {
    deleteExperience(id: $id) {
      id
    }
  }
`;
