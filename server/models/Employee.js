const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    }
});

employeeSchema.pre('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      let hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
    } catch (err) {
      return next(err);
    }
  });
  
employeeSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
      let isMatched = await bcrypt.compare(candidatePassword, this.password);
      return isMatched;
    } catch (err) {
      return next(err);
    }
  };

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

// profile: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Profile',
//     required: true
// },
// onboardingApplication: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'OnboardingApplication',
//     required: true
// },
// visaStatus: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'VisaStatus',
//     required: true
// }