const express = require('express');
const app = express();
require('dotenv').config();
// const connectDB = require('./db');

// connectDB();

const graphqlHandler = require('./graphql');
app.use('/graphql', graphqlHandler);

app.listen({ port: process.env.PORT });
console.log(`Listening to port ${process.env.PORT}`);