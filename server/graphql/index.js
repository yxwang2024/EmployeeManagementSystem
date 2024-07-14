const { makeExecutableSchema } = require('graphql-tools')
const merge = require('lodash.merge');

const employeeSchema = require('./employee')
const profileSchema = require('./profile')

const schema = makeExecutableSchema({
    typeDefs: [
        employeeSchema.typeDefs, 
        profileSchema.typeDefs
    ],
    resolvers: merge(
        employeeSchema.resolvers,
        profileSchema.resolvers
    )
})


module.exports = schema