const documentSchema = /* GraphQL */`
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
    getDocument(id: ID!): Document
  }

  extend type Mutation {
    createDocument(input: DocumentInput!): Document
    deleteDocument(id: ID!): String
  }
`;

export default documentSchema;