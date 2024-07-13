const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visaStatusSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  step: {
    type: String,
    enum: ["OPT Receipt", "OPT EAD", "i983", "I20" ],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewing", "Approved", "Rejected"],
    required: true,
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

module.exports = VisaStatus;
