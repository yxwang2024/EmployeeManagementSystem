// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const mailHistorySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  registrationToken: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "expired"],
    required: true,
    default: "pending",
  },
  expiration: {
    type: Date,
    required: true,
    // default is 24 hours
    default: Date.now + 24 * 60 * 60 * 1000,
  },
  name: {
    type: String,
    required: true,
  },
  // onboardingApp: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "OnboardingApp",
  //   required: true,
  // },
});

const MailHistory = mongoose.model("MailHistory", mailHistorySchema);

export default MailHistory;