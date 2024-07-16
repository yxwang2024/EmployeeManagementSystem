import OnboardingApplication from '../../models/OnboardingApplication.js';
import Employee from '../../models/Employee.js';
import Document from '../../models/Document.js';

import * as dotenv from 'dotenv';
dotenv.config();

import { checkAuth, isHR, isEmployee } from '../../services/auth.js';

const onboardingApplicationResolvers = {
    Query: {
        getOnboardingApplication: async (_, { id }, context) => {
            try {
                //auth: employee self or HR
                const user = checkAuth(context);
                const employee = Employee.findOne({ onboardingApplication: id });
                const employeeId = employee._id;
                if (!isEmployee(user, employeeId) && !isHR(user)) {
                    throw new Error('Authorization failed.');
                }

                return await OnboardingApplication.findById(id);
            } catch (err) {
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
            console.log(input);
            const { id, firstName, middleName, lastName, preferredName } = input;
            const name = { firstName, middleName, lastName, preferredName };

            //auth: employee self
            const user = checkAuth(context);
            const employee = Employee.findOne({ onboardingApplication: id });
            const employeeId = employee._id;
            if (!isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { name: name },
                { new: true }
            );
            return updatedOA;
        },
        updateOAIdentity: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, ssn, dob, gender } = input;
            const identity = { ssn, dob, gender };

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ onboardingApplication: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { identity: identity },
                { new: true }
            );
            return updatedOA;
        },
        updateOACurrentAddress: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, street, building, city, state, zip } = input;
            const address = { street, building, city, state, zip };

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ onboardingApplication: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { currentAddress: address },
                { new: true }
            );
            return updatedOA;
        },
        updateOAContactInfo: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, cellPhone, workPhone } = input;
            const contactInfo = { cellPhone, workPhone };

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ onboardingApplication: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { contactInfo: contactInfo },
                { new: true }
            );
            return updatedOA;
        },
        updateOAEmployment: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, visaTitle, startDate, endDate } = input;
            const employment = { visaTitle, startDate, endDate };

            //auth: employee self
            const user = checkAuth(context);
            const employee = Employee.findOne({ onboardingApplication: id });
            const employeeId = employee._id;
            if (!isEmployee(user, employeeId)) {
                throw new Error('Authorization failed.');
            }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { employment: employment },
                { new: true }
            );
            return updatedOA;
        },
        updateOAReference: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, firstName, lastName, middleName, phone, email, relationship } = input;
            const reference = { firstName, lastName, middleName, phone, email, relationship };

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ onboardingApplication: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { reference: reference },
                { new: true }
            );
            return updatedOA;
        },
        updateOAEmergencyContact: async (parent, { input }, context, info) => {
            console.log(input);
            const { id, emergencyContacts } = input;

             //auth: employee self
             const user = checkAuth(context);
             const employee = Employee.findOne({ onboardingApplication: id });
             const employeeId = employee._id;
             if (!isEmployee(user, employeeId)) {
                 throw new Error('Authorization failed.');
             }

            const updatedOA = await OnboardingApplication.findByIdAndUpdate(
                id,
                { emergencyContacts: emergencyContacts },
                { new: true }
            );
            return updatedOA;
        },

        updateOAStatus: async (parent, { status }, context, info) => {
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
        },

        updateOAHrFeedback: async (parent, { hrFeedback }, context, info) => {
            console.log(input);
            const { id, emergencyContacts } = input;

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
        },
        addOADocument: async (parent, { input }, context, info) => {
            try {
                console.log(input);
                const { id, documentId } = input;

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