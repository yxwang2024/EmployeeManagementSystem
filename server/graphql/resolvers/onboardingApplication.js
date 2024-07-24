import OnboardingApplication from '../../models/OnboardingApplication.js';
import Employee from '../../models/Employee.js';
import Document from '../../models/Document.js';
import User from '../../models/User.js';
import { checkAuth, isHR, checkUser, isEmployee } from '../../services/auth.js';
import { ObjectId } from "mongodb";

import * as dotenv from 'dotenv';
dotenv.config();

const onboardingApplicationResolvers = {
    Query: {
        getOnboardingApplication: async (_, { oaId }, context) => {
            try {
                //auth: employee self or HR
                const decodedUser = await checkAuth(context);
        
                const employee = await Employee.findOne({ onboardingApplication: oaId });
                const user = await User.findOne({ instance: employee._id });
                const userId = user._id.toString();
                if (!checkUser(decodedUser, userId) && !isHR(decodedUser)) {
                    throw new Error('Query id and auth user do not match.');
                }
        
                const onboardingApplication = await OnboardingApplication.findById(oaId).populate('documents');
                return onboardingApplication;
            } catch (err) {
                console.error(err);
                throw new Error(err);
            }
        },

        getAllOnboardingApplications: async (parent, args, context) => {
            try {
                //auth:HR
                const user = await checkAuth(context);
                if (!isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                const applications = await OnboardingApplication.find();
                return applications;
            } catch (err) {
                throw new Error(err);
            }
        },

        getOnboardingApplicationConnection: async (_, { query, first, after, last, before, status }) => {
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
              let sort = { _id: last ? -1 : 1 };
              let limit = first || last || 10;
      
              if (after) {
                paginationQuery._id = { $gt: ObjectId.createFromHexString(after) };
              }
      
              if (before) {
                paginationQuery._id = { $lt: ObjectId.createFromHexString(before) };
                sort = { _id: -1 };
              }

              let statusFilter = {};
              if (status) {
                switch (status) {
                  case "Pending":
                    statusFilter = { status: "Pending" };
                    break;
                  case "Approved":
                    statusFilter = { status: "Approved" };
                    break;
                  case "Rejected":
                    statusFilter = { status: "Rejected" };
                    break;
                  default:
                    break;
                }
              }
                    
              const OnboardingApps = await OnboardingApplication.find({
                ...searchQuery,
                ...paginationQuery,
                ...statusFilter,
              })
                .sort(sort)
                .limit(limit);
      
              if (before || last) {
                OnboardingApps.reverse();
              }
      
              const edges = OnboardingApps.map((Oapp) => ({
                cursor: Oapp._id.toString(),
                node: Oapp,
              }));
      
              const totalCount = await OnboardingApplication.countDocuments({ ...searchQuery, ...statusFilter });
      
              const pageInfo = {
                hasNextPage: OnboardingApps.length === limit && !before,
                hasPreviousPage: OnboardingApps.length === limit && !after,
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
        updateOAName: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, firstName, middleName, lastName, preferredName } = input;
                const name = { firstName, middleName, lastName, preferredName };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                //oa status should not be Pending or Approved
                const oa = await OnboardingApplication.findById(id);
                if(oa.status==="Pending"){
                    throw new Error('The application is waiting for reviewing.');
                }
                if(oa.status==="Approved"){
                    throw new Error('The application has been approved.');
                }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { name: name },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAIdentity: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, ssn, dob, gender } = input;
                const identity = { ssn, dob, gender };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { identity: identity },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAProfilePic: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, profilePicture } = input;
        
                const decodedUser = await checkAuth(context);
        
                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }
        
                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }
                // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", profilePicture);
                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { profilePicture: profilePicture },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOACurrentAddress: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, street, building, city, state, zip } = input;
                const address = { street, building, city, state, zip };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { currentAddress: address },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAContactInfo: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, cellPhone, workPhone } = input;
                const contactInfo = { cellPhone, workPhone };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { contactInfo: contactInfo },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAEmployment: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, visaTitle, startDate, endDate } = input;
                const employment = { visaTitle, startDate, endDate };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { employment: employment },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAReference: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, firstName, lastName, middleName, phone, email, relationship } = input;
                const reference = { firstName, lastName, middleName, phone, email, relationship };

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { reference: reference },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        updateOAEmergencyContact: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, emergencyContacts } = input;

                //auth: employee self
                const decodedUser = await checkAuth(context);

                const employee = await Employee.findOne({onboardingApplication:id});
                const user = await User.findOne({instance:employee._id});
                const userId = user._id.toString();
                if( !checkUser(decodedUser,userId)){
                    throw new Error('Query id and auth user do not match.');
                }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { emergencyContacts: emergencyContacts },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },

        updateOAStatus: async (parent, { input }, context, info) => {
            try {
                const { id, status } = input;

                //auth: employee self or HR
                const decodedUser = await checkAuth(context);
        
                const employee = await Employee.findOne({ onboardingApplication: id });
                const user = await User.findOne({ instance: employee._id });
                const userId = user._id.toString();
                if (!checkUser(decodedUser, userId) && !isHR(decodedUser)) {
                    throw new Error('Query id and auth user do not match.');
                }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { status: status },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },

        updateOAHrFeedback: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, hrFeedback } = input;

                //auth:HR
                const user = await checkAuth(context);
                if (!isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { hrFeedback: hrFeedback },
                    { new: true }
                );
                return updatedOA;
            } catch (error) {
                console.error(error);
            }
        },
        addOADocument: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, documentId } = input;

                 //auth: employee self
                 const decodedUser = await checkAuth(context);

                 const employee = await Employee.findOne({onboardingApplication:id});
                 const user = await User.findOne({instance:employee._id});
                 const userId = user._id.toString();
                 if( !checkUser(decodedUser,userId)){
                     throw new Error('Query id and auth user do not match.');
                 }

                 //oa status should not be Pending or Approved
                 const oa = await OnboardingApplication.findById(id);
                 if(oa.status==="Pending"){
                     throw new Error('The application is waiting for reviewing.');
                 }
                 if(oa.status==="Approved"){
                     throw new Error('The application has been approved.');
                 }

                const document = await Document.findById(documentId);
                if (!document) {
                    throw new Error("Document not found");
                }
                const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                    id,
                    { $push: { "documents": documentId }, },
                    { new: true }).populate("documents");
                return updatedOA;
            } catch (err) {
                throw new Error(err);
            }
        },
        deleteOADocument: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, documentId } = input;

                 //auth: employee self
                 const decodedUser = await checkAuth(context);

                 const employee = await Employee.findOne({onboardingApplication:id});
                 const user = await User.findOne({instance:employee._id});
                 const userId = user._id.toString();
                 if( !checkUser(decodedUser,userId)){
                     throw new Error('Query id and auth user do not match.');
                 }
                const document = await Document.findById(documentId);
                if (!document) {
                    throw new Error("Document not found");
                }
                // check if current status is "Rejected"
                const oa = await OnboardingApplication.findById(id);
                if (oa.status !== "Rejected") {
                    throw new Error("You can only re-upload document if the onboarding application is rejected");
                }

                //remove from oa document list
                // const updatedOA = await OnboardingApplication.findByIdAndUpdate(id, {
                //     $pop: { "documents": documentId },
                // }, { new: true }).populate("documents");
                const updatedOA = await OnboardingApplication.findByIdAndUpdate(id, {
                    $pull: { documents: documentId },
                  }, { new: true }).populate("documents");
                  
                console.log("!!!!!", updatedOA)
                //delete from document db
                await Document.findByIdAndDelete(documentId);

                return updatedOA;
            } catch (err) {
                throw new Error(err);
            }
        },          
    },
};

export default onboardingApplicationResolvers;