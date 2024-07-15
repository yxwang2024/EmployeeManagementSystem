import { mergeResolvers } from "@graphql-tools/merge";
import pkg from 'lodash';
const { merge } = pkg;
import visaStatusResolvers from "./visaStatus.js";
import documentResolvers from "./document.js";
import mailHistoryResolvers from "./mailHistory.js";
import employeeResolvers from "./employee.js";
import profileResolvers from "./profile.js";
import hrResolvers from "./hr.js";

// const { mergeResolvers } = require("@graphql-tools/merge");
// const { merge } = require("lodash");
// const visaStatusResolvers = require("./visaStatus");
// const documentResolvers = require("./document");
// const mailHistoryResolvers = require("./mailHistory");


// const resolvers = mergeResolvers([
//   visaStatusResolvers,
//   documentResolvers,
//   mailHistoryResolvers,
// ]);
const testResolvers = {
  Query: {
    test: () => "Test Success",
  },
  Mutation: {
    testMutation: () => "Test Mutation Success",
  },
};

const resolvers = merge(testResolvers, visaStatusResolvers, documentResolvers, mailHistoryResolvers,employeeResolvers,profileResolvers,hrResolvers);
// const resolvers = mergeResolvers([testResolvers, visaStatusResolvers, documentResolvers, mailHistoryResolvers]);

export default resolvers;