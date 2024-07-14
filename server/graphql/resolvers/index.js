const { mergeResolvers } = require("@graphql-tools/merge");
const { merge } = require("lodash");
const visaStatusResolvers = require("./visaStatus");
const documentResolvers = require("./document");
const mailHistoryResolvers = require("./mailHistory");


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

const resolvers = merge(testResolvers, visaStatusResolvers, documentResolvers, mailHistoryResolvers);

module.exports = resolvers;