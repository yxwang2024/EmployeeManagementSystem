// TODO: npm install graphql-tag @apollo/subgraph @apollo/server 
// use apollo instead of express
const { buildSchema } = require('graphql');
const documentSchema = require('./document')
const mailHistorySchema = require('./mailHistory');
const visaStatusSchema = require('./visaStatus');


const linkSchema = `#graphql
  type Query {
    test: String
  }

  type Mutation {
    testMutation: String
  }

  
  # type Subscription {
  #   _: Boolean
  # }
 
`;

const schema = buildSchema(`
  ${linkSchema}
  ${documentSchema}
  ${mailHistorySchema}
  ${visaStatusSchema}
`);

module.exports = schema;