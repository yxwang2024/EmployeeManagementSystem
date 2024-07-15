// const nodemailer =require('nodemailer');
// require('dotenv').config();
// const emailService = require('./services/emailServices');



// //test sending email
// const toEmail = 'fechuwa@gmail.com';
// const subject = 'Test 1';
// const html = '<h1>Hi how are you</h1>';
// emailService.sendEmail(toEmail,subject,html);


import express from 'express';
import cors from 'cors';
import resolvers from './graphql/resolvers/index.js';
import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { readFileSync } from "fs";
import { mergeTypeDefs } from '@graphql-tools/merge';

const { default: graphqlUploadExpress } = await (eval(
  `import('graphql-upload/graphqlUploadExpress.mjs')`,
));

import connectDB from './db/index.js';
connectDB();

const app = express();

const indexSchema = readFileSync("./graphql/schemas/index.graphql", { encoding: "utf-8" });
const documentSchema = readFileSync("./graphql/schemas/document.graphql", { encoding: "utf-8" });
const mailHistorySchema = readFileSync("./graphql/schemas/mailHistory.graphql", { encoding: "utf-8" });
const visaStatusSchema = readFileSync("./graphql/schemas/visaStatus.graphql", { encoding: "utf-8" });
const typeDefs = mergeTypeDefs([indexSchema, documentSchema, mailHistorySchema, visaStatusSchema]);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  csrfPrevention: true,
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  expressMiddleware(server),
);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/graphql`);
});