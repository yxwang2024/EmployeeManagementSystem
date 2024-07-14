const mailHistorySchema = `
  type MailHistory {
    _id: ID!
    email: String!
    registrationToken: String!
    expiration: String!
    name: String!
    onboardingApp: OnboardingApp!
  }

  input MailHistoryInput {
    email: String!
    registrationToken: String!
    expiration: String!
    name: String!
    onboardingApp: ID!
  }

  extend type Query {
    getMailHistories: [MailHistory]
    getMailHistory(id: ID!): MailHistory
  }

  extend type Mutation {
    createMailHistory(mailHistoryInput: MailHistoryInput): MailHistory
    deleteMailHistory(id: ID!): MailHistory
  }
`;

export default mailHistorySchema;