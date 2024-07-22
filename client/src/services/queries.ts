export const GET_ALL_STATUS_LIST = `
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
            step
            status
          }
        }
`;

export const GET_VISA_STATUS_CONNECTION = `
query GetVisaStatusConnection($first: Int, $after: String, $last: Int, $before: String, $query: String) {
  getVisaStatusConnection(first: $first, after: $after, last: $last, before: $before, query: $query) {
    totalCount
    edges {
      cursor
      node {
        _id
        employee {
          profile {
            name {
              firstName
              middleName
              lastName
              preferredName
            }
            email
          }
        }
        status
        step
        workAuthorization {
          title
          startDate
          endDate
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`;
