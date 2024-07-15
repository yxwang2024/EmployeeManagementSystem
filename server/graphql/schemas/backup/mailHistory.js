const mailHistorySchema = /* GraphQL */`
  type MailHistory {
    _id: ID!
    email: String!
    registrationToken: String!
    expiration: String!
    name: String!
    status: String!
    # onboardingApp: OnboardingApp!
  }

  input MailHistoryInput {
    email: String!
    name: String!
    # onboardingApp: ID!
  }

  extend type Query {
    getMailHistories: [MailHistory]
    getMailHistory(id: ID!): MailHistory
  }

  extend type Mutation {
    createMailHistory(mailHistoryInput: MailHistoryInput): MailHistory
    updateMailHistory(id: ID!, status: String!): MailHistory
    deleteMailHistory(id: ID!): MailHistory
  }
`;

export default mailHistorySchema;