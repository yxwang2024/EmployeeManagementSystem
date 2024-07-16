import Employee from '../../models/Employee.js';
import Profile from '../../models/Profile.js';
import * as dotenv from 'dotenv';
dotenv.config();

import { checkAuth, isHR, isEmployee } from '../../services/auth.js';

const profileResolvers = {
    Query: {
        getAllProfiles: async (parent, context, info) => {
            try {
                //auth:HR
                const user = await checkAuth(context);
                if (!isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                const profiles = await Profile.find();
                if (!profiles) {
                    throw new Error('Profiles not found');
                }
                return profiles;
            } catch (error) {
                console.error(error);
            }
        },
        getProfile: async (parent, { id }, context, info) => {
            try {
                //auth: employee self or HR
                const user = checkAuth(context);
                const employee = Employee.findOne({ profile: id });
                const employeeId = employee._id;
                if (!isEmployee(user, employeeId) && !isHR(user)) {
                    throw new Error('Authorization failed.');
                }

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

            //auth: employee self
            const user = checkAuth(context);
            const employee = Employee.findOne({ profile: id });
            const employeeId = employee._id;
            if (!isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

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

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ profile: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

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

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ profile: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

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

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ profile: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

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

            //auth: employee self
            const user = checkAuth(context);
            const employee = Employee.findOne({ profile: id });
            const employeeId = employee._id;
            if (!isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { employment: employment },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileReference: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, firstName, lastName, middleName, phone, email, relationship } = input;
            const reference = { firstName, lastName, middleName, phone, email, relationship };

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ profile: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { reference: reference },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileEmergencyContact: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, emergencyContacts } = input;

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ profile: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedProfile = await Profile.findByIdAndUpdate(
                id,
                { emergencyContacts: emergencyContacts },
                { new: true }
            );
            return updatedProfile;
        },
    },
};

export default profileResolvers;