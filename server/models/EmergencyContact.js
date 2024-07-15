import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const emergencyContactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    }
});

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

export default EmergencyContact;