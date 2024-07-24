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

export const GET_PROFILE_CONNECTION = `
  query GetProfileConnection($first: Int, $after: String, $last: Int, $before: String, $query: String) {
    getProfileConnection(first: $first, after: $after, last: $last, before: $before, query: $query) {
      totalCount
      edges {
        cursor
        node {
          id
          email
          name {
            firstName
            middleName
            lastName
            preferredName
          }
          identity {
            ssn
          }
          contactInfo {
            cellPhone
          }
          employment {
            visaTitle
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

export const APPROVE_ONBOARDING = `
  mutation UpdateOAStatus($input: OAStatusInput) {
    updateOAStatus(input: $input) {
      id
      email
      status
      hrFeedback
    }
  }
`;

export const REJECT_ONBOARDING = `
  mutation UpdateOAStatus($input: OAStatusInput) {
    updateOAStatus(input: $input) {
      id
      email
      status
      hrFeedback
    }
  }
`;

export const UPDATE_ONBOARDING_HR_FEEDBACK = `
  mutation UpdateOAHrFeedback($input: OAHrFeedbackInput) {
    updateOAHrFeedback(input: $input) {
      id
      email
      hrFeedback
      status
    }
  }
`;

export const GET_ONBOARDING_CONNECTION = `
  query GetOnboardingApplicationConnection($first: Int, $after: String, $last: Int, $before: String, $query: String, $status: String) {
    getOnboardingApplicationConnection(first: $first, after: $after, last: $last, before: $before, query: $query, status: $status) {
      totalCount
      edges {
        cursor
        node {
          id
          email
          name {
            firstName
            middleName
            lastName
            preferredName
          }
          status
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

export const GET_ONBOARDING = `
  query GetOnboardingApplication($oaId: ID!) {
    getOnboardingApplication(oaId: $oaId) {
      id
      email
      name {
        firstName
        middleName
        lastName
        preferredName
      }
      profilePicture
      identity {
        ssn
        dob
        gender
      }
      currentAddress {
        street
        building
        city
        state
        zip
      }
      contactInfo {
        cellPhone
        workPhone
      }
      employment {
        visaTitle
        startDate
        endDate
      }
      reference {
        firstName
        lastName
        middleName
        phone
        email
        relationship
      }
      emergencyContacts {
        id
        firstName
        lastName
        middleName
        phone
        email
        relationship
      }
      documents {
        _id
        title
        timestamp
        filename
        url
        key
      }
      status
      hrFeedback
    }
  }
`;
export const GET_PROFILE_BY_ID = `
query GetProfileByUserId($userId: ID!) {
  getProfileByUserId(userId: $userId) {
    id
    email
    name {
      firstName
      middleName
      lastName
      preferredName
    }
    profilePicture
    identity {
      ssn
      dob
      gender
    }
    currentAddress {
      street
      building
      city
      state
      zip
    }
    contactInfo {
      cellPhone
      workPhone
    }
    employment {
      visaTitle
      startDate
      endDate
    }
    reference {
      firstName
      lastName
      middleName
      phone
      email
      relationship
    }
    emergencyContacts {
      id
      firstName
      lastName
      middleName
      phone
      email
      relationship
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

export const GET_PROFILE = `
  query GetProfile($getProfileId: ID!) {
    getProfile(id: $getProfileId) {
      id
      email
      name {
        firstName
        middleName
        lastName
        preferredName
      }
      profilePicture
      identity {
        ssn
        dob
        gender
      }
      currentAddress {
        street
        building
        city
        state
        zip
      }
      contactInfo {
        cellPhone
        workPhone
      }
      employment {
        visaTitle
        startDate
        endDate
      }
      reference {
        firstName
        lastName
        middleName
        phone
        email
        relationship
      }
      emergencyContacts {
        id
        firstName
        lastName
        middleName
        phone
        email
        relationship
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

export const SEND_NOTIFICATION = `
  mutation SendNotification($notificationInput: NotificationInput) {
    sendNotification(notificationInput: $notificationInput)
  }
`;

export const UPDATE_PROFILE_BY_OAID = `
  mutation UpdateProfileByOAId($oaId: String) {
    updateProfileByOAId(oaId: $oaId) {
      id
      email
    }
  }
`;