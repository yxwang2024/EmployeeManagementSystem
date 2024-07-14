const db = require('../../models');

const resolvers = {
    Query: {
        profiles: async () => await db.Profile.find(),
        profile: async (parent, { id }, context, info) => {
            try {
                const profile = await db.Profile.findById(id);
                if (!profile) {
                    throw new Error('Profile not found');
                }
                return profile;
            } catch (error) {
                console.error("Error fetching profile:", error);
                throw new Error("Failed to fetch profile");
            }
        },
        profileByEmail: async ({ email }) => await db.Profile.findOne(email)
    },
    Mutation: {
        updateProfileName: async (_, { input }) => {
            console.log(input);
            const { id, firstName, middleName, lastName, preferredName } = input;
            const name = { firstName, middleName, lastName, preferredName };
            const updatedProfile = await db.Profile.findByIdAndUpdate(
                id,
                { name: name },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileIdentity: async (_, { input }) => {
            console.log(input);
            const { id, ssn, dob, gender } = input;
            const identity = { ssn, dob, gender };
            const updatedProfile = await db.Profile.findByIdAndUpdate(
                id,
                { identity: identity },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileCurrentAddress: async (_, { input }) => {
            console.log(input);
            const { id, street, building, city, state, zip } = input;
            const address = { street, building, city, state, zip };
            const updatedProfile = await db.Profile.findByIdAndUpdate(
                id,
                { currentAddress: address },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileContactInfo: async (_, { input }) => {
            console.log(input);
            const { id, cellPhone, workPhone } = input;
            const contactInfo = { cellPhone, workPhone };
            const updatedProfile = await db.Profile.findByIdAndUpdate(
                id,
                { contactInfo: contactInfo },
                { new: true }
            );
            return updatedProfile;
        },
        updateProfileEmployment: async (_, { input }) => {
            console.log(input);
            const { id, visaTitle, startDate, endDate } = input;
            const employment = { visaTitle, startDate, endDate  };
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