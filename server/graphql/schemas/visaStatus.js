const visaStatusSchema = `#graphql
  type VisaStatus {
    _id: ID!
    # employee: Employee!
    step: String!
    status: String!
    hrFeedback: String
    workAuthorization: WorkAuthorization!
    documents: [Document]
  }

  type WorkAuthorization {
    title: String!
    startDate: String!
    endDate: String!
  }

  input WorkAuthorizationInput {
    title: String!
    startDate: String!
    endDate: String!
  }

  input VisaStatusInput {
    # employee: ID!
    step: String!
    status: String!
    hrFeedback: String
    workAuthorization: WorkAuthorizationInput!
    documents: [ID]
  }

  extend type Query {
    getVisaStatuses: [VisaStatus]
    getVisaStatus(id: ID!): VisaStatus
  }

  extend type Mutation {
    createVisaStatus(visaStatusInput: VisaStatusInput): VisaStatus
    updateVisaStatus(id: ID!, visaStatusInput: VisaStatusInput): VisaStatus
    approveVisaStatus(id: ID!): VisaStatus
    moveToNextStep(id: ID!): VisaStatus
    rejectVisaStatus(id: ID!, hrFeedback: String!): VisaStatus
    addDocument(id: ID!, documentId: ID!): VisaStatus
    reUploadDocument(id: ID!, documentId: ID!): VisaStatus
    deleteVisaStatus(id: ID!): VisaStatus
  }
  
  # extend type Subscription {
  #   visaStatusAdded: VisaStatus
  #   visaStatusUpdated: VisaStatus
  #   visaStatusDeleted: VisaStatus
  # }
`;

module.exports = visaStatusSchema;