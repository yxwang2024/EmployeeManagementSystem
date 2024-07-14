// const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
// const jwt = require('jsonwebtoken');
// const db = require('../models');

// const schema = buildSchema(`
//     type Query {
//         hello: String
//         employees: [Employees]
//         employee(id: ID!): Employee
//     }

//     type Mutation {
//         register(email: String!, username: String!, password: String!): Response
//         signIn(email: String!, password: String!): Response
//     }

//     type Employee {
//         id: ID!
//         email: String!
//         username: String!
//         password: String!
//     }
// `);

// const root = {
//   hello: () => 'Hello world!',
// //   signUp: async ({ email, username, password, profileImageUrl }) => {
// //     const user = await db.User.create({
// //       email,
// //       username,
// //       password,
// //       profileImageUrl
// //     });
// //     const token = await jwt.sign(
// //       {
// //         id: user._id,
// //         username: user.username,
// //         profileImageUrl: user.profileImageUrl
// //       },
// //       process.env.JWT_SECRET_KEY,
// //       { expiresIn: '30d' }
// //     );
// //     return { user, token, message: 'User created successfully' };
// //   },
// //   signIn: async ({ email, password }) => {
// //     const user = await db.User.findOne({ email });
// //     if (!user) {
// //       throw new Error('No user with that email');
// //     }
// //     const valid = await user.comparePassword(password);
// //     if (!valid) {
// //       throw new Error('Incorrect password');
// //     }
// //     const token = await jwt.sign(
// //       {
// //         id: user._id,
// //         username: user.username,
// //         profileImageUrl: user.profileImageUrl
// //       },
// //       process.env.JWT_SECRET_KEY,
// //       { expiresIn: '30d' }
// //     );
// //     return { user, token, message: 'User signed in successfully' };
// //   },

// //   users: async () => await db.User.find(),
// //   user: async ({ id }) => await db.User.findById(id)
// };

// module.exports = graphqlHTTP({
//   schema,
//   rootValue: root,
//   graphiql: true
// });