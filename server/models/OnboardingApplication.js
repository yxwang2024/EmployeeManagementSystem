import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const onboardingApplicationSchema = new Schema({
    status: {
        type: String,
        enum: ['NotSubmitted','Pending', 'Approved', 'Rejected'],
        required: true
    }
});

const OnboardingApplication = mongoose.model('OnboardingApplication', onboardingApplicationSchema);

export default OnboardingApplication;