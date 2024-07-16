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
import http from 'http';
import resolvers from './graphql/resolvers/index.js';
import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
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

import { getUser } from './services/auth.js';
const app = express();
const httpServer = http.createServer(app);

const indexSchema = readFileSync("./graphql/schemas/index.graphql", { encoding: "utf-8" });
const documentSchema = readFileSync("./graphql/schemas/document.graphql", { encoding: "utf-8" });
const mailHistorySchema = readFileSync("./graphql/schemas/mailHistory.graphql", { encoding: "utf-8" });
const visaStatusSchema = readFileSync("./graphql/schemas/visaStatus.graphql", { encoding: "utf-8" });
const employeeSchema = readFileSync("./graphql/schemas/employee.graphql", { encoding: "utf-8" });
const profileSchema = readFileSync("./graphql/schemas/profile.graphql", { encoding: "utf-8" });
const hrSchema = readFileSync("./graphql/schemas/hr.graphql", { encoding: "utf-8" });
const onboardingApplicationSchema = readFileSync("./graphql/schemas/onboardingApplication.graphql", { encoding: "utf-8" });
const userSchema = readFileSync("./graphql/schemas/user.graphql", { encoding: "utf-8" });
const typeDefs = mergeTypeDefs([indexSchema, documentSchema, mailHistorySchema, visaStatusSchema, employeeSchema,profileSchema,hrSchema,onboardingApplicationSchema,userSchema]);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  csrfPrevention: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// const { url } = await startStandaloneServer(server, {
//   context: async ({ req, res }) => {
//     const token = req.headers.authorization || '';
//     const user = await getUser(token);
//     return { user };
//   },
//   listen: { port: process.env.PORT },
// });
// console.log(`🚀 Server listening at: ${url}`);
await server.start();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization || '';
  const user = await getUser(token);
  req.user = user;
  next();
};

// app.use(
//   '/graphql',
//   cors(),
//   express.json({ limit: '50mb' }),
//   express.urlencoded({ extended: true }),
//   graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
//   authMiddleware,
//   expressMiddleware(server),
// );
app.use(
  '/graphql',
  cors(),
  express.json({ limit: '50mb' }),
  express.urlencoded({ extended: true }),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const token = req.headers?.authorization?.split(' ')?.[1] || '';
      const user = await getUser(token);
      return {token, user };
    },
  }),
);
// app.use(
//   '/graphql',
//   cors(),
//   express.json(),
//   express.urlencoded({ extended: true }),
//   graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
//   expressMiddleware(server),
// );

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/graphql`);
});
