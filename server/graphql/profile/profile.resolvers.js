const db = require('../../models');
const auth = require('../../services/auth');

const resolvers = {
    Query: {
        profiles: async (parent, context, info) => {
            try {
                const user = auth.checkAuth(context);
                if (!auth.isHR(user)) {
                    throw new Error('Only HR can get all profiles');
                }

                const profiles = await db.Profile.find();
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
                const user = auth.checkAuth(context);
                const employee = db.Employee.findOne(id);
                const employeeId = employee._id;
                if (!auth.isEmployee(user, employeeId) || !auth.isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                const profile = await db.Profile.findById(id);
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

            const user = auth.checkAuth(context);
            const employee = db.Employee.findOne(id);
            const employeeId = employee._id;
            if (!auth.isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await db.Profile.findByIdAndUpdate(
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

            const user = auth.checkAuth(context);
            const employee = db.Employee.findOne(id);
            const employeeId = employee._id;
            if (!auth.isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await db.Profile.findByIdAndUpdate(
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

            const user = auth.checkAuth(context);
            const employee = db.Employee.findOne(id);
            const employeeId = employee._id;
            if (!auth.isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await db.Profile.findByIdAndUpdate(
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

            const user = auth.checkAuth(context);
            const employee = db.Employee.findOne(id);
            const employeeId = employee._id;
            if (!auth.isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await db.Profile.findByIdAndUpdate(
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

            const user = auth.checkAuth(context);
            const employee = db.Employee.findOne(id);
            const employeeId = employee._id;
            if (!auth.isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedProfile = await db.Profile.findByIdAndUpdate(
                id,
                { employment: employment },
                { new: true }
            );
            return updatedProfile;
        },

    }
}

module.exports = resolvers