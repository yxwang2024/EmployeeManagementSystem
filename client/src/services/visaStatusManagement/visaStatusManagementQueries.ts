import gql from "graphql-tag";

export const GET_VISA_STATUS_LIST = gql`
  query GetVisaStatuses {
      getVisaStatuses {
        _id
        employee {
          profile {
            name {
              firstName
              middleName
              lastName
            }
          }
        }
        workAuthorization {
          title
          startDate
          endDate
        }
        status
      }
    }
`;