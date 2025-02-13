import User from '../../models/User.js';
import Employee from '../../models/Employee.js';
import HR from '../../models/HR.js';
import Profile from '../../models/Profile.js';
import MailHistory from '../../models/MailHistory.js';
import OnboardingApplication from '../../models/OnboardingApplication.js';

import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { generateToken, decodeToken } from '../../services/registrationToken.js';
import { checkAuth,checkUser, isHR, isEmployee } from '../../services/auth.js';
const userResolvers = {
    UserInstance: {
        __resolveType(obj) {
            if (obj.onboardingApplication) {
                return 'EmployeeInstance';
            }
            else{
                return 'HRInstance';
            }
        }
    },
    Query: {
        getUser: async (_, { id }, context) => {
            try {
                console.log('!!!Starting getUser function with ID:', id); // 添加日志
                //auth
                const decodedUser = await checkAuth(context);

                const user = await User.findById(id).populate(['instance']);
                if ( user.role == 'HR' && !isHR(decodedUser)) {
                    throw new Error('HR role needed.');
                }
                console.log(user);
                const userId = user._id.toString();
                if(!checkUser(decodedUser,userId)){
                    console.log('!!!Query id and auth user do not match.'); // 添加日志
                    throw new Error('!!!Query id and auth user do not match.');
                }
        
                console.log('!!!Returning user:', user); // 添加日志
                return user;
            } catch (err) {
                console.error('!!!Error in getUser function:', err); // 添加日志
                throw new Error(err);
            }
        },

        getAllUsers: async (parent, args, context) => {
            try {
                //auth
                const decodedUser = await checkAuth(context);
                if(!isHR(decodedUser)){
                    throw new Error('HR role needed.');
                }

                const allUsers = await User.find().populate('instance');
                return allUsers;
            } catch (err) {
                throw new Error(err);
            }
        },

    },
    Mutation: {
        Login: async (_, { input }, context) => {
            try {
                const { email, password } = input;
                const findUser = await User.findOne({ email }).populate('instance')
                let user;
                if ( findUser && findUser.role == 'HR') {
                    // populate HR instance
                    user = await User.findOne({ email }).populate(['instance', {path: 'instance', populate: 'mailHistory'}]);
                } else if ( findUser && findUser.role == 'Employee') {
                    // populate Employee instance
                    user = await User.findOne({ email }).populate(['instance', {path: 'instance', populate: 'onboardingApplication'}]);
                }
                console.log('populatedUser:',user);
                if (!findUser) {
                    throw new Error('No user with that email');
                }

                const valid = await findUser.comparePassword(password);
                if (!valid) {
                    throw new Error('Incorrect password');
                }

                const token = await jwt.sign(
                    {
                        id: findUser._id,
                        username: findUser.username,
                        role: findUser.role
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '30d' }
                );
                return { user, token, message: 'Employee signed in successfully' };

            } catch (err) {
                throw new Error(err);
            }
        },

        EmployeeRegister: async (_, { input }, context) => {
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
                const existing = await User.findOne({
                    email,
                });
                if (existing) {
                    throw new Error('Existing email');
                }

                const profile = new Profile({ email });
                await profile.save();
                const onboardingApplication = new OnboardingApplication({
                    email,
                    status: "NotSubmitted"
                });
                await onboardingApplication.save();
                const employee = new Employee({
                    username,
                    email,
                    profile: profile,
                    onboardingApplication: onboardingApplication
                });
                await employee.save();

                const newUser = new User({
                    username,
                    email,
                    password,
                    role:"Employee",
                    instance:employee
                });
                await newUser.save();

                await MailHistory.findByIdAndUpdate(mailHistory._id, { status: "completed" }, {
                    new: true,
                });

                const token = await jwt.sign(
                    {
                        id: newUser._id,
                        username: employee.username,
                        role: "Employee"
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '30d' }
                );
                console.log(newUser);
                return { user:newUser, token, message: 'Employee registered successfully' };

            } catch (err) {
                throw new Error(err);
            }
        },
        HRRegister: async (_, { input }, context) => {
            try {
                const { email, username, password } = input;
                
                // Check if the email is already in use
                const existing = await HR.findOne({
                    email,
                });
                if (existing) {
                    throw new Error('Existing email');
                }

                const hr = new HR({
                    username,
                    email,
                    password,
                });
                await hr.save();

                const newUser = new User({
                    username,
                    email,
                    password,
                    role:"HR",
                    instance:hr
                });
                await newUser.save();
                const token = await jwt.sign(
                    {
                        id: newUser._id,
                        username: newUser.username,
                        role: "HR"
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '30d' }
                );
                return { user:newUser, token, message: 'HR registered successfully' };

            } catch (err) {
                throw new Error(err);
            }
        },

    },
};

export default userResolvers;