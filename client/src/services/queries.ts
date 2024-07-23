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
query GetVisaStatusConnection($first: Int, $after: String, $last: Int, $before: String, $query: String,$status: String) {
  getVisaStatusConnection(first: $first, after: $after, last: $last, before: $before, query: $query, status: $status) {
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


export const GET_VISA_STATUS = `
  query GetVisaStatus($getVisaStatusId: ID!) {
  getVisaStatus(id: $getVisaStatusId) {
    _id
    employee {
      email
      profile {
        name {
          firstName
          middleName
          lastName
        }
      }
    }
    step
    status
    hrFeedback
    workAuthorization {
      title
      startDate
      endDate
    }
    documents {
      _id
      title
      timestamp
      filename
      url
      key
    }
  }
}
`;

export const APPROVE_VISA_STATUS = `
  mutation ApproveVisaStatus($approveVisaStatusId: ID!) {
    approveVisaStatus(id: $approveVisaStatusId) {
      status
      step
      _id
      employee
    }
  }
`;

export const REJECT_VISA_STATUS = `
  mutation RejectVisaStatus($rejectVisaStatusId: ID!, $hrFeedback: String!) {
    rejectVisaStatus(id: $rejectVisaStatusId, hrFeedback: $hrFeedback) {
      step
      status
      hrFeedback
      _id
      employee
    }
  }
`;




