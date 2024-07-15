const gql = require('graphql-tag')

const typeDefs = gql`
    type Query {
        signIn(input: EmployeeLogin!): Response
        employees: [Employee]
        employee(id: ID!): Employee
    }

    type Mutation {
        signUp(input: EmployeeMutation!): Response
    }

    type Employee {
        id: ID!
        email: String!
        username: String!
        password: String!
    }

    type Response {
        employee: Employee
        token: String
        message: String
    }

    input EmployeeLogin {
        email: String!
        password: String!
    }

    input EmployeeMutation {
        email: String!
        username: String!
        password: String!
    }
`

module.exports = typeDefs