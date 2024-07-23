// import Employee from '../../models/Employee';
import VisaStatus from "../../models/VisaStatus.js";
import Document from "../../models/Document.js";
import Joi from "joi";
import Employee from "../../models/Employee.js";
import { ObjectId } from "mongodb";

const visaStatusInputSchema = Joi.object({
  employee: Joi.string().required(),
  step: Joi.string().valid("OPT Receipt", "OPT EAD", "i983", "I20"),
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
        // const visaStatuses = await VisaStatus.find().populate("documents");
        const visaStatuses = await VisaStatus.find().populate([
          "documents",
          "employee",
          { path: "employee", populate: "profile" },
        ]);
        return visaStatuses;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatus: async (_, { id }) => {
      try {
        // const visaStatus = await VisaStatus.findById(id).populate("documents");
        const visaStatus = await VisaStatus.findById(id).populate([
          "documents",
          "employee",
          { path: "employee", populate: "profile" },
        ]);
        return visaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatusByEmployee: async (_, { employeeId }) => {
      try {
        const visaStatus = await VisaStatus.findOne({
          employee: employeeId,
        }).populate(["documents"]);
        if (!visaStatus) {
          throw new Error("Visa status not found");
        }
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
        // allow partial search

        // if query is empty, return all visa statuses
        if (query === "") {
          const visaStatuses = await VisaStatus.find().populate([
            "documents",
            "employee",
            { path: "employee", populate: "profile" },
          ]);
          return visaStatuses;
        }
        const employees = await Employee.aggregate([
          {
            $lookup: {
              from: "profiles", // The name of the collection containing profile details
              localField: "profile",
              foreignField: "_id",
              as: "profileDetails",
            },
          },
          {
            $unwind: "$profileDetails", // Unwind the array to make it easier to query
          },
          {
            $match: {
              $or: [
                {
                  "profileDetails.name.firstName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.middleName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.lastName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.preferredName": {
                    $regex: query,
                    $options: "i",
                  },
                },
              ],
            },
          },
        ]);

        console.log(employees);
        const filteredResults = await VisaStatus.find({
          employee: { $in: employees },
        }).populate([
          "documents",
          "employee",
          { path: "employee", populate: "profile" },
        ]);
        return filteredResults;
      } catch (err) {
        throw new Error(err);
      }
    },
    getVisaStatusConnection: async (
      _,
      { query,status, first, after, last, before }
    ) => {
      try {
        if ((first && last) || (after && before)) {
          throw new Error("You must provide only one pair of pagination arguments: (first, after) or (last, before).");
        }
        // if query is empty, return all visa statuses
        const searchQuery = query
          ? {
              $or: [
                {
                  "profileDetails.name.firstName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.middleName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.lastName": {
                    $regex: query,
                    $options: "i",
                  },
                },
                {
                  "profileDetails.name.preferredName": {
                    $regex: query,
                    $options: "i",
                  },
                },
              ],
            }
          : {};

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

        const employees = await Employee.aggregate([
          {
            $lookup: {
              from: "profiles", // The name of the collection containing profile details
              localField: "profile",
              foreignField: "_id",
              as: "profileDetails",
            },
          },
          {
            $unwind: "$profileDetails", // Unwind the array to make it easier to query
          },
          {
            $match: searchQuery,
          },
        ]);

        const employeeIds = employees.map((employee) => employee._id);

        let statusFilter = {};
        if (status) {
          switch (status) {
            case "Approved":
              statusFilter = { 
                status: "Approved",
                step: "I20"
              };
              break;
            case "In Progress":
              statusFilter = {
                $or: [
                  { step: { $ne: "I20" } },
                  { status: { $ne: "Approved" } }
                ]
              };
              break;
            default:
              statusFilter = { status };
              break;
          }
        }
        console.log("statusFilter", status);

        const visaStatuses = await VisaStatus.find({
          employee: { $in: employeeIds },
          ...paginationQuery,
          ...statusFilter,
        })
          .populate([
            "documents",
            "employee",
            { path: "employee", populate: "profile" },
          ])
          .sort(sort)
          .limit(limit);

        if (before || last) {
          visaStatuses.reverse();
        }

        const edges = visaStatuses.map((visaStatus) => ({
          cursor: visaStatus._id.toString(),
          node: visaStatus,
        }));

        const totalCount = await VisaStatus.countDocuments({
          employee: { $in: employeeIds },
        });

        const pageInfo = {
          hasNextPage: visaStatuses.length === limit && !before,
          hasPreviousPage: visaStatuses.length === limit && !after,
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
    // add employee to visa status
    createVisaStatus: async (
      _,
      {
        visaStatusInput: {
          employee,
          step,
          status,
          hrFeedback,
          workAuthorization,
          documents,
        },
      }
    ) => {
      try {
        const { error } = visaStatusInputSchema.validate({
          employee,
          step,
          status,
          hrFeedback,
          workAuthorization,
          documents,
        });
        if (error) {
          throw new Error(error);
        }
        // check if the employee exists
        const employeeExists = await Employee.findById(employee);
        if (!employeeExists) {
          throw new Error("Employee not found");
        }
        const newVisaStatus = new VisaStatus({
          employee,
          step,
          status,
          hrFeedback: "",
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
        const visaStatus = await VisaStatus.findByIdAndUpdate(
          id,
          { status: "Approved" },
          { new: true }
        ).populate("documents");
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
        const steps = ["OPT Receipt", "OPT EAD", "I-983", "I20"];
        const currentStepIndex = steps.indexOf(visaStatus.step);
        if (visaStatus.status !== "Approved") {
          throw new Error(
            "You can only move to the next step if the visa status is approved"
          );
        }
        let nextStep = steps[currentStepIndex];
        // if the visa status is approved, move to the next step
        if (visaStatus.status === "Approved") {
          nextStep = steps[currentStepIndex + 1];
        }
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(
          id,
          { step: nextStep, status: "Pending" },
          { new: true }
        ).populate("documents");
        return updatedVisaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    rejectVisaStatus: async (_, { id, hrFeedback }) => {
      try {
        const visaStatus = await VisaStatus.findByIdAndUpdate(
          id,
          { status: "Rejected", hrFeedback: hrFeedback },
          { new: true }
        ).populate("documents");
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
        console.log("add document", id, documentId);
        const document = await Document.findById(documentId);
        if (!document) {
          throw new Error("Document not found");
        }
        const visaStatus = await VisaStatus.findOneAndUpdate(
          { employee: id },
          {
            $push: { documents: documentId },
            $set: { status: "Reviewing" },
          },
          { new: true }
        ).populate("documents");
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
        const visaStatus = await VisaStatus.findOne({ employee: id });
        if (visaStatus.status !== "Rejected") {
          throw new Error(
            "You can only re-upload document if the visa status is rejected"
          );
        }
        // remove the last document and add the new one
        const test = await VisaStatus.findByIdAndUpdate(visaStatus._id, {
          $pop: { documents: -1 },
        });
        const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(
          visaStatus._id,
          {
            $push: { documents: documentId },
            $set: { status: "Reviewing", hrFeedback: "" },
          },
          { new: true }
        ).populate("documents");
        return updatedVisaStatus;
      } catch (err) {
        throw new Error(err);
      }
    },
    updateVisaStatus: async (
      _,
      {
        id,
        visaStatusInput: {
          step,
          status,
          hrFeedback,
          workAuthorization,
          documents,
        },
      }
    ) => {
      try {
        const { error } = visaStatusInputSchema.validate({
          step,
          status,
          hrFeedback,
          workAuthorization,
          documents,
        });
        if (error) {
          throw new Error(error);
        }
        const visaStatus = await VisaStatus.findByIdAndUpdate(
          id,
          { step, status, hrFeedback, workAuthorization, documents },
          { new: true }
        ).populate("documents");
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
