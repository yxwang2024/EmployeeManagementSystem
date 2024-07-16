import Employee from '../../models/Employee.js';
import Profile from '../../models/Profile.js';
import MailHistory from '../../models/MailHistory.js';
import OnboardingApplication from '../../models/OnboardingApplication.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { generateToken, decodeToken } from '../../services/registrationToken.js';
import { checkAuth, isHR, isEmployee } from '../../services/auth.js';
const employeeResolvers = {
    Query: {
        getEmployee: async (_, { id }, context) => {
            try {
                //auth: employee self or HR
                const user = await checkAuth(context);
                if (!isEmployee(user, id) && !isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                return await Employee.findById(id);
            } catch (err) {
                throw new Error(err);
            }
        },

        getEmployees: async (parent, args, context) => {
            try {
                //auth:only HR
                const user = await checkAuth(context);
                if (!isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                const employees = await Employee.find();
                return employees;
            } catch (err) {
                throw new Error(err);
            }
        },

    },
    Mutation: {
        loginEmployee: async (_, { input }, context) => {
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
        registerEmployee: async (_, { input }, context) => {
            try {
                const { registrationToken, email, username, password } = input;

                //check registration token
                const mailHistory = await MailHistory.findOne({ registrationToken: registrationToken });
                if (!mailHistory) {
                    throw new Error('Invalid registrationToken');
                }
                if (mailHistory.status == 'completed') {
                    throw new Error('The registration has completed.');
                }

                const expirationDate = new Date(mailHistory.expiration);
                if (expirationDate < Date.now()) {
                    throw new Error('The registration token expired.');
                }

                // Check if the email is already in use
                const existing = await Employee.findOne({
                    email,
                });
                if (existing) {
                    throw new Error('Existing email');
                }

                const profile = new Profile({ email });
                await profile.save();
                const onboardingApplication = new OnboardingApplication({ 
                    email,
                    status:"NotSubmitted"
                });
                await onboardingApplication.save();
                const employee = new Employee({
                    username,
                    email,
                    password,
                    profile: profile,
                    onboardingApplication:onboardingApplication
                });
                await employee.save();
                const newMailHistory = await MailHistory.findByIdAndUpdate(mailHistory._id, {status:"completed"}, {
                    new: true,
                  });

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