import OnboardingApplication from '../../models/OnboardingApplication.js';
import Employee from '../../models/Employee.js';
import Document from '../../models/Document.js';
import User from '../../models/User.js';
import { checkAuth, isHR, checkUser, isEmployee } from '../../services/auth.js';
import mongoose from 'mongoose';

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
        
                const onboardingApplication = await OnboardingApplication.findById(oaId);
                // console.log('Fetched Onboarding Application:', onboardingApplication);
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

        // getVisaStatusWithQuery: async (_, { query }) => {
        //     try {
        //       // find employees by first name, last name or preferred name
        //       // cover one found, multiple found, none found
        //       // Name { First name, Last name, Middle name, Preferred name } is under Employee/profile
        //       const filteredEmployees = await Employee.find({
        //         $or: [
        //           { "profile.firstName": { $regex: query, $options: "i" } },
        //           { "profile.lastName": { $regex: query, $options: "i" } },
        //           { "profile.middleName": { $regex: query, $options: "i" } },
        //           { "profile.preferredName": { $regex: query, $options: "i" } },
        //         ],
        //       }).populate(["profile", "onboardingApplication", "onboardingApplication.documents"]);
        //       const filteredResults = filteredEmployees.map(employee => {
        //         const Obj = {
        //           name: `${employee.profile.firstName} ${employee.profile.middleName? employee.profile.middleName + " " : ""}${employee.profile.lastName}`,
        //           onboardingApplication: employee.onboardingApplication,
        //         };
        //         return Obj;
        //       });
        //       return filteredResults; 
        //     } catch (err) {
        //       throw new Error(err);
        //     }
        //   },
        
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

                //auth:HR
                const user = await checkAuth(context);
                if (!isHR(user)) {
                    throw new Error('Authorization failed.');
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
                const updatedOA = await OnboardingApplication.findByIdAndUpdate(id, {
                    $pop: { "documents": documentId },
                }, { new: true }).populate("documents");

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