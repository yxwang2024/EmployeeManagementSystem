import Employee from '../../models/Employee.js';
import User from '../../models/User.js';
import Profile from '../../models/Profile.js';
import MailHistory from '../../models/MailHistory.js';
import OnboardingApplication from '../../models/OnboardingApplication.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { generateToken, decodeToken } from '../../services/registrationToken.js';
import { checkAuth, isHR, checkUser, isEmployee } from '../../services/auth.js';
const employeeResolvers = {
    Query: {
        getEmployee: async (_, { employeeId }, context) => {
            try {
                //auth: employee self or HR
                const decodedUser = await checkAuth(context);

                const user = await User.findOne({instance:employeeId});
                //console.log("user:     ",user);
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId) && !isHR(decodedUser)){
                    throw new Error('Query id and auth user do not match.');
                }

                return await Employee.findById(employeeId);
            } catch (err) {
                throw new Error(err);
            }
        },

        getEmployees: async (parent, args, context) => {
            try {
                //auth:only HR
                const decodedUser = await checkAuth(context);
                if (!isHR(decodedUser)) {
                    throw new Error('Authorization failed.');
                }

                const employees = await Employee.find();
                return employees;
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};

export default employeeResolvers;