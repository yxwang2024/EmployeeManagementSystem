const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const db = require('../models');
        // employees: [Employees]
        // employee(id: ID!): Employee
        //        
const schema = buildSchema(`
    type Query {
        hello: String,
        employees: [Employee]
        employee(id: ID!): Employee
    }

    type Mutation {
        signUp(email: String!, username: String!, password: String!): Response
        signIn(email: String!, password: String!): Response
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
`);
const root = {
  hello: () => 'Hello world!',
  signUp: async ({ email, username, password }) => {
    const employee = await db.Employee.create({
      email,
      username,
      password
    });
    const token = await jwt.sign(
      {
        id: employee._id,
        username: employee.username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );

    return { employee, token, message: 'Employee signed in successfully' };
  },
  signIn: async ({ email, password }) => {
    const employee = await db.Employee.findOne({ email });
    if (!employee) {
      throw new Error('No employee with that email');
    }
    const valid = await employee.comparePassword(password);
    if (!valid) {
      throw new Error('Incorrect password');
    }
    const token = await jwt.sign(
      {
        id: employee._id,
        username: employee.username
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );
    return { employee, token, message: 'Employee signed in successfully' };
  },

  employees: async () => await db.Employee.find(),
  employee: async ({ id }) => await db.Employee.findById(id)
};

module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
});