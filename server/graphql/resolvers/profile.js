import Employee from '../../models/Employee.js';
import Profile from '../../models/Profile.js';
import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { generateToken,decodeToken } from '../../services/registrationToken.js';
import { checkAuth , isHR,isEmployee} from '../../services/auth.js';
const profileResolvers = {
    Query: {
        profiles: async (parent, context, info) => {
            try {
                //auth

                const profiles = await Profile.find();
                if (!profiles) {
                    throw new Error('Profiles not found');
                }
                return profiles;
            } catch (error) {
                console.error(error);
            }
        },
        profile: async (parent, { id }, context, info) => {
            try {
                //auth
                //const user = auth.checkAuth(context);
                //const employee = Employee.findOne(id);
                //const employeeId = employee._id;
                // if (!auth.isEmployee(user, employeeId) || !auth.isHR(user)) {
                //     throw new Error('Authorization failed.');
                // }

                const profile = await Profile.findById(id);
                if (!profile) {
                    throw new Error('Profile not found');
                }
                return profile;
            } catch (error) {
                console.error(error);
            }
        },
        
    },
    Mutation: {
        updateProfileName: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, firstName, middleName, lastName, preferredName } = input;
            const name = { firstName, middleName, lastName, preferredName };

            //auth
            // const user = auth.checkAuth(context);
            // const employee = Employee.findOne(id);
            // const employeeId = employee._id;
            // if (!auth.isEmployee(user, employeeId)) {
            //     throw new Error('Authorization failed.');
            // }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { name: name },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileIdentity: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, ssn, dob, gender } = input;
            const identity = { ssn, dob, gender };

            // //auth
            // const user = auth.checkAuth(context);
            // const employee = Employee.findOne(id);
            // const employeeId = employee._id;
            // if (!auth.isEmployee(user, employeeId)) {
            //     throw new Error('Authorization failed.');
            // }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { identity: identity },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileCurrentAddress: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, street, building, city, state, zip } = input;
            const address = { street, building, city, state, zip };

            // //auth
            // const user = auth.checkAuth(context);
            // const employee = Employee.findOne(id);
            // const employeeId = employee._id;
            // if (!auth.isEmployee(user, employeeId)) {
            //     throw new Error('Authorization failed.');
            // }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { currentAddress: address },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileContactInfo: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, cellPhone, workPhone } = input;
            const contactInfo = { cellPhone, workPhone };

            // //auth
            // const user = auth.checkAuth(context);
            // const employee = Employee.findOne(id);
            // const employeeId = employee._id;
            // if (!auth.isEmployee(user, employeeId)) {
            //     throw new Error('Authorization failed.');
            // }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { contactInfo: contactInfo },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileEmployment: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, visaTitle, startDate, endDate } = input;
            const employment = { visaTitle, startDate, endDate };

            // //auth
            // const user = auth.checkAuth(context);
            // const employee = Employee.findOne(id);
            // const employeeId = employee._id;
            // if (!auth.isEmployee(user, employeeId)) {
            //     throw new Error('Authorization failed.');
            // }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { employment: employment },
                { new: true }
            );
            return updatedProfile;
        },
    },
};

export default profileResolvers;