const mongoose = require("mongoose");
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
  onboardingApp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnboardingApp",
    required: true,
  },
});
