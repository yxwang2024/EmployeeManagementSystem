import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const employeeSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    unique: true
  },
  onboardingApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OnboardingApplication',
    unique: true
  }
});


const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;