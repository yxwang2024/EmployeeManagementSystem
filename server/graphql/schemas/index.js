// TODO: npm install graphql-tag @apollo/subgraph @apollo/server 
// use apollo instead of express

import { buildSchema } from 'graphql';
import documentSchema from './documents';
import mailHistorySchema from './mailHistory';
import visaStatusSchema from './visaStatus';

const linkSchema = `#graphql
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
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

export default schema;