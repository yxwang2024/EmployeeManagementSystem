require('dotenv').config();

const express = require('express');
const { graphqlHTTP } = require('express-graphql')

const app = express();
const schema = require('./graphql')

app.use('/graphql', graphqlHTTP(req => ({
    schema,
    graphiql: true
     
})))
app.listen({ port: process.env.PORT });
console.log(`Listening to port ${process.env.PORT}`);