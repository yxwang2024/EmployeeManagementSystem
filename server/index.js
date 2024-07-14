// const nodemailer =require('nodemailer');
// require('dotenv').config();
// const emailService = require('./services/emailServices');



// //test sending email
// const toEmail = 'fechuwa@gmail.com';
// const subject = 'Test 1';
// const html = '<h1>Hi how are you</h1>';
// emailService.sendEmail(toEmail,subject,html);


const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();
const { makeExecutableSchema } = require('@graphql-tools/schema')

const connectDB = require('./db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const graphql = graphqlHTTP({
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  }),
  graphiql: true,
});

app.use('/graphql', graphql);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});