import Employee from "../../models/Employee.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";

import { checkAuth, isHR, checkUser, isEmployee } from "../../services/auth.js";
import { ObjectId } from "mongodb";

import * as dotenv from "dotenv";
dotenv.config();

const profileResolvers = {
  Query: {
    getAllProfiles: async (parent, args, context) => {
      try {
        //auth:HR
        const user = await checkAuth(context);
        if (!isHR(user)) {
          throw new Error("Authorization failed.");
        }

        const profiles = await Profile.find().populate('documents');
        if (!profiles) {
          throw new Error("Profiles not found");
        }
        return profiles;
      } catch (error) {
        console.error(error);
      }
    },
    getProfile: async (parent, { id }, context, info) => {
      try {
        //auth: employee self or HR
        const decodedUser = await checkAuth(context);

        const employee = await Employee.findOne({ profile: id });
        const user = await User.findOne({ instance: employee._id });
        const userId = user._id.toString();
        if (!checkUser(decodedUser, userId) && !isHR(decodedUser)) {
          throw new Error("Query id and auth user do not match.");
        }

        const profile = await Profile.findById(id).populate('documents');
        if (!profile) {
          throw new Error("Profile not found");
        }
        return profile;
      } catch (error) {
        console.error(error);
      }
    },
    getProfileConnection: async (_, { query, first, after, last, before }) => {
      try {
        if ((first && last) || (after && before)) {
          throw new Error(
            "You must provide only one pair of pagination arguments: (first, after) or (last, before)."
          );
        }
        // if query is empty, return all visa statuses
        const searchQuery = query
          ? {
              $or: [
                {
                  "name.firstName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "name.middleName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "name.lastName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "name.preferredName": {
                    $regex: query,
                    $options: "i",
                  },
                },
              ],
            }
          : {};

           // Exclude profiles with firstName as an empty string
          searchQuery["name.firstName"] = { $ne: "" };

        let paginationQuery = {};
        //let sort = { _id: last ? -1 : 1 };
        let sort = { "name.lastName": 1 }; 
        let limit = first || last || 10;

        if (after) {
          paginationQuery._id = { $gt: ObjectId.createFromHexString(after) };
        }

        if (before) {
          paginationQuery._id = { $lt: ObjectId.createFromHexString(before) };
          sort = { _id: -1 };
        }

        const profiles = await Profile.find({ ...searchQuery, ...paginationQuery })
          .sort(sort)
          .limit(limit);

        if (before || last) {
          profiles.reverse();
        }

        const edges = profiles.map((profile) => ({
          cursor: profile._id.toString(),
          node: profile,
        }));

        const totalCount = await Profile.countDocuments(searchQuery);

        const pageInfo = {
          hasNextPage: profiles.length === limit && !before,
          hasPreviousPage: profiles.length === limit && !after,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        };

        return {
          totalCount,
          edges,
          pageInfo,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    updateProfileName: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, firstName, middleName, lastName, preferredName } = input;
      const name = { firstName, middleName, lastName, preferredName };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { name: name },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileIdentity: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, ssn, dob, gender } = input;
      const identity = { ssn, dob, gender };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { identity: identity },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileCurrentAddress: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, street, building, city, state, zip } = input;
      const address = { street, building, city, state, zip };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { currentAddress: address },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileContactInfo: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, cellPhone, workPhone } = input;
      const contactInfo = { cellPhone, workPhone };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { contactInfo: contactInfo },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileEmployment: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, visaTitle, startDate, endDate } = input;
      const employment = { visaTitle, startDate, endDate };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { employment: employment },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileReference: async (parent, { input }, context, info) => {
      console.log(input);
      const {
        id,
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship,
      } = input;
      const reference = {
        firstName,
        lastName,
        middleName,
        phone,
        email,
        relationship,
      };

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { reference: reference },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileEmergencyContact: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, emergencyContacts } = input;

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { emergencyContacts: emergencyContacts },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
    updateProfileDocuments: async (parent, { input }, context, info) => {
      console.log(input);
      const { id, documents } = input;

      //auth: employee self
      const decodedUser = await checkAuth(context);

      const employee = await Employee.findOne({ profile: id });
      const user = await User.findOne({ instance: employee._id });
      const userId = user._id.toString();
      if (!checkUser(decodedUser, userId)) {
        throw new Error("Query id and auth user do not match.");
      }

      const updatedProfile = await Profile.findByIdAndUpdate(
        id,
        { documents: documents },
        { new: true }
      ).populate('documents');
      return updatedProfile;
    },
  },
};

export default profileResolvers;
