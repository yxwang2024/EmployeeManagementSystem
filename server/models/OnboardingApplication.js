const mongoose = require('mongoose');

const onboardingApplicationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        required: true
    }
});

const OnboardingApplication = mongoose.model('OnboardingApplication', onboardingApplicationSchema);

module.exports = OnboardingApplication;
