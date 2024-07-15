const jwt = require('jsonwebtoken')
const db = require('../../models');

const resolvers = {
  Query: {
    signIn: async (_, { input }) => {
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
          username: employee.username,
          role: "Employee"
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
    signUp: async (_, { input }) => {
      //check registration token


      const { email, username, password } = input;
      // Check if the email is already in use
      const existing = await db.Employee.findOne({
        email,
      });
      if (existing) {
        throw new Error('Existing email');
      }
      const profile = new db.Profile({ email: email });
      await profile.save();
      const employee = new db.Employee({
        username,
        email,
        password,
        profile: profile._id,
      });
      await employee.save();
      const token = await jwt.sign(
        {
          id: employee._id,
          username: employee.username,
          role: "Employee"
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' }
      );

      return { employee, token, message: 'Employee signed in successfully' };
    }
  }
}

module.exports = resolvers