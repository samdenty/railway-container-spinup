import { graphql } from "react-relay";

export const ProjectsQuery = graphql`
  query operationsProjectsQuery {
    me {
      id
      email
      name
      workspaces {
        id
        name
        projects(first: 50) {
          edges {
            node {
              id
              name
              description
              updatedAt
              environments(first: 20) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              services(first: 50) {
                edges {
                  node {
                    id
                    name
                    icon
                    updatedAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ProjectQuery = graphql`
  query operationsProjectQuery($id: String!) {
    project(id: $id) {
      id
      name
      description
      updatedAt
      environments(first: 20) {
        edges {
          node {
            id
            name
          }
        }
      }
      services(first: 50) {
        edges {
          node {
            id
            name
            icon
            updatedAt
          }
        }
      }
    }
  }
`;

export const ServiceCreateMutation = graphql`
  mutation operationsServiceCreateMutation($input: ServiceCreateInput!) {
    serviceCreate(input: $input) {
      id
      name
      icon
      projectId
      templateId
      templateServiceId
      createdAt
    }
  }
`;

export const ServiceDeleteMutation = graphql`
  mutation operationsServiceDeleteMutation($id: String!) {
    serviceDelete(id: $id)
  }
`;

export const ProjectDeleteMutation = graphql`
  mutation operationsProjectDeleteMutation($id: String!) {
    projectDelete(id: $id)
  }
`;
