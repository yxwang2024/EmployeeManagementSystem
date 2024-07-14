const VisaStatus = require('../../models/VisaStatus');
const Document = require('../../models/Document');
const Joi = require('joi');
// import Employee from '../../models/Employee';


const visaStatusInputSchema = Joi.object({
  // employee: Joi.string().required(),
  step: Joi.string().valid("registration", "OPT Receipt", "OPT EAD", "i983", "I20").required(),
  status: Joi.string().valid("Pending", "Reviewing", "Approved", "Rejected").required(),
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
        const visaStatuses = await VisaStatus.find();
        return visaStatuses;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatus: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findById(id);
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
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
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    approveVisaStatus: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { status: "Approved" }, { new: true });
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    moveToNextStep: async (_, { id }) => {
      try {
        const visaStatus = await VisaStatus.findById(id);
        if (visaStatus.status !== "Approved") {
          throw new Error("You can only move to the next step if the visa status is approved");
        }
        const steps = ["registration", "OPT Receipt", "OPT EAD", "i983", "I20"];
        const currentStepIndex = steps.indexOf(visaStatus.step);
        if (currentStepIndex === steps.length - 1) {
          throw new Error("You have reached the last step");
        }
        const nextStep = steps[currentStepIndex + 1];
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(id, { step: nextStep, status: "Pending" }, { new: true });
        return updatedVisaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    rejectVisaStatus: async (_, { id, hrFeedback }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { status: "Rejected", hrFeedback }, { new: true });
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
        }, { new: true });
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
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(id, {
          $pop: {"documents": -1},
          $push: {"documents": documentId},
          $set: { status: "Reviewing" },
        }, { new: true });
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
        const visaStatus = await VisaStatus.findByIdAndUpdate(id, { step, status, hrFeedback, workAuthorization, documents }, { new: true });
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

module.exports = visaStatusResolvers;

