// import Employee from '../../models/Employee';
import VisaStatus from '../../models/VisaStatus.js';
import Document from '../../models/Document.js';
import Joi from 'joi';


const visaStatusInputSchema = Joi.object({
  employee: Joi.string(),
  step: Joi.string().valid("registration", "OPT Receipt", "OPT EAD", "i983", "I20"),
  status: Joi.string().valid("Pending", "Reviewing", "Approved", "Rejected"),
  hrFeedback: Joi.string(),
  workAuthorization: Joi.object({
    title: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }).required(),
  documents: Joi.array().items(Joi.string()),
});

const visaStatusResolvers = {
  Query: {
    getVisaStatuses: async () => {
      try {
        const visaStatuses = await VisaStatus.find().populate("documents");
        // const visaStatuses = await VisaStatus.find().populate(["documents", "employee", "employee.profile"]);
        return visaStatuses;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatus: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findById(id).populate("documents");
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatusWithQuery: async (_, { query }) => {
      try {
        // find employees by first name, last name or preferred name
        // cover one found, multiple found, none found
        // Name { First name, Last name, Middle name, Preferred name } is under Employee/profile
        const filteredEmployees = await Employee.find({
          $or: [
            { "profile.firstName": { $regex: query, $options: "i" } },
            { "profile.lastName": { $regex: query, $options: "i" } },
            { "profile.middleName": { $regex: query, $options: "i" } },
            { "profile.preferredName": { $regex: query, $options: "i" } },
          ],
        }).populate(["profile", "visaStatus", "visaStatus.documents"]);
        const filteredResults = filteredEmployees.map(employee => {
          const Obj = {
            name: `${employee.profile.firstName} ${employee.profile.middleName? employee.profile.middleName + " " : ""}${employee.profile.lastName}`,
            visaStatus: employee.visaStatus,
          };
          return Obj;
        });
        return filteredResults; 
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // add employee to visa status
    createVisaStatus: async (_, { visaStatusInput: { step, status, hrFeedback, workAuthorization, documents } }) => {
      try {
        const { error } = visaStatusInputSchema.validate({ step, status, hrFeedback, workAuthorization, documents });
        if (error) {
          throw new Error(error);
        }
        const newVisaStatus = new VisaStatus({
          // employee,
          step,
          status,
          hrFeedback:"",
          workAuthorization,
          documents: [],
        });
        const visaStatus = await newVisaStatus.save();
        return visaStatus;
        
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteVisaStatus: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndDelete(id);
        if (!visaStatus) {
          throw new Error("Visa status not found");
        }
        return "Visa status deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
    approveVisaStatus: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { status: "Approved" }, { new: true }).populate("documents");
        if (!visaStatus) {
          throw new Error("Visa status not found");
        }
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    moveToNextStep: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findById(id);
        const steps = ["registration", "OPT Receipt", "OPT EAD", "i983", "I20"];
        const currentStepIndex = steps.indexOf(visaStatus.step);
        if (visaStatus.status !== "Approved" && steps[currentStepIndex] !== "registration") {
          throw new Error("You can only move to the next step if the visa status is approved");
        }
        let nextStep = steps[currentStepIndex];
        // if the visa status is approved, move to the next step
        if (visaStatus.status === "Approved") {
          nextStep = steps[currentStepIndex + 1];
        } 
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(id, { step: nextStep, status: "Pending" }, { new: true }).populate("documents");
        return updatedVisaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    rejectVisaStatus: async (_, { id, hrFeedback }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { status: "Rejected", hrFeedback: hrFeedback }, { new: true }).populate("documents");
        if (!visaStatus) {
          throw new Error("Visa status not found");
        }
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    addDocument: async (_, { id, documentId }) => {
      try {
        const document = await Document.findById(documentId);
        if (!document) {
          throw new Error("Document not found");
        }
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, {
          $push: {"documents": documentId},
          $set: { status: "Reviewing" },
        }, { new: true }).populate("documents");
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },   
    reUploadDocument: async (_, { id, documentId }) => {
      try {
        const document = await Document.findById(documentId);
        if (!document) {
          throw new Error("Document not found");
        }
        // check if current status is "Rejected"
        const visaStatus = await VisaStatus.findById(id);
        if (visaStatus.status !== "Rejected") {
          throw new Error("You can only re-upload document if the visa status is rejected");
        }
        // remove the last document and add the new one
        await VisaStatus.findByIdAndUpdate(id, {
          $pop: {"documents": -1},
        });
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(id, {
          $push: {"documents": documentId},
          $set: { status: "Reviewing", hrFeedback: "" },
        }, { new: true }).populate("documents");
        return updatedVisaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    updateVisaStatus: async (_, { id, visaStatusInput: { step, status, hrFeedback, workAuthorization, documents } }) => {
      try {
        const { error } = visaStatusInputSchema.validate({ step, status, hrFeedback, workAuthorization, documents });
        if (error) {
          throw new Error(error);
        }
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { step, status, hrFeedback, workAuthorization, documents }, { new: true }).populate("documents");
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  // Subscription: {
  //   visaStatusAdded: {
  //     subscribe: () => pubsub.asyncIterator('VISA_STATUS_ADDED'),
  //   },
  //   visaStatusUpdated: {
  //     subscribe: () => pubsub.asyncIterator('VISA_STATUS_UPDATED'),
  //   },
  //   visaStatusDeleted: {
  //     subscribe: () => pubsub.asyncIterator('VISA_STATUS_DELETED'),
  //   },
  // },
};  

export default visaStatusResolvers;
