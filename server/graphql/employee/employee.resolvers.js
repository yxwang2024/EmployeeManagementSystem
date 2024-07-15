const jwt = require('jsonwebtoken')
const db = require('../../models');

const resolvers = {
    Query: {
        signIn: async ( _,{ input } ) => {
            const { email, password } = input;
            console.log(email);
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
    },
    Mutation: {
        signUp: async (_,{ input }) => {
            const { email, username, password } = input;
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
          }
    }
}

module.exports = resolvers