// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const visaStatusSchema = new Schema({
  // employee: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Employee",
  //   required: true,
  // },
  step: {
    type: String,
    enum: ["registration", "OPT Receipt", "OPT EAD", "i983", "I20" ],
    default: "registration",
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewing", "Approved", "Rejected"],
    default: "Pending",
  },
  hrFeedback: {
    type: String,
  },
  workAuthorization: {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  documents: {
   type: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: "Document",
   }],
   default: [], 
  }
});

const VisaStatus = mongoose.model("VisaStatus", visaStatusSchema);

export default VisaStatus;