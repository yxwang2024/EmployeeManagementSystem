const { makeExecutableSchema } = require('@graphql-tools/schema')
const { mergeResolvers } = require('@graphql-tools/merge');

const employeeSchema = require('./employee')

// Multiple files to keep your project modularised
const schema = makeExecutableSchema({
    typeDefs: [
        employeeSchema.typeDefs // First defines the type Query
    ],
    resolvers: mergeResolvers(
        employeeSchema.resolvers
    )
})

module.exports = schema