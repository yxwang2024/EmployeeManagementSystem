// TODO: npm install graphql-tag @apollo/subgraph @apollo/server 
// use apollo instead of express
import documentSchema from './document.js';
import mailHistorySchema from '../mailHistory.js';
import visaStatusSchema from '../visaStatus.js';
import { mergeTypeDefs } from '@graphql-tools/merge';

const linkSchema = /* GraphQL */ `
  type Query {
    test: String
  }

  type Mutation {
    testMutation: String
  }
`;

const schema = mergeTypeDefs([linkSchema, documentSchema, mailHistorySchema, visaStatusSchema]);

export default schema;