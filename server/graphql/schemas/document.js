const documentSchema = `#graphql
  type Document {
    _id: ID!
    title: String!
    timestamp: String!
    filename: String!
    url: String!
    key: String!
  }

  scalar Upload

  input DocumentInput {
    title: String!
    file: Upload!
  }

  extend type Query {
    getAllDocuments: [Document]
    getDocuments(userId: ID!): [Document]
    getDocument(id: ID!): Document
  }

  extend type Mutation {
    createDocument(input: DocumentInput!): Document
    deleteDocument(id: ID!): Document
  }
`;

export default documentSchema;