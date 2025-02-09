import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const hrSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mailHistory: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "MailHistory",
      },
    ],
    default: [],
  },
});

const HR = mongoose.model("HR", hrSchema);

export default HR;
