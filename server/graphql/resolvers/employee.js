import Employee from '../../models/Employee.js';
import Profile from '../../models/Profile.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { generateToken,decodeToken } from '../../services/registrationToken.js';
import { checkAuth , isHR,isEmployee} from '../../services/auth.js';
const employeeResolvers = {
    Query: {
        employee: async (_, { id }, context) => {
            try {
                //auth
                return await Employee.findById(id);
            } catch (err) {
                throw new Error(err);
            }
        },

        employees: async (parent, args, contextValue) => {
            try {
                //auth
                const employees = await Employee.find();
                return employees;
            } catch (err) {
                throw new Error(err);
            }
        },
        
    },
    Mutation: {
        logIn: async (_, { input }, context) => {
            const { email, password } = input;
            const employee = await Employee.findOne({ email });
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
        register: async (_, { input }, context) => {
            try {
                const { email, username, password } = input;
                //check registration token
                // const { hrId, employeeEmail, employeeName } = await decodeToken(registrationToken);
                
                // Check if the email is already in use
                const existing = await Employee.findOne({
                    email,
                });
                if (existing) {
                    throw new Error('Existing email');
                }
                const profile = new Profile({ email });
                await profile.save();
                const employee = new Employee({
                    username,
                    email,
                    password,
                    profile:profile
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
                return { employee, token, message: 'Employee registered successfully' };

            } catch (err) {
                throw new Error(err);
            }
        },
    },
};

export default employeeResolvers;