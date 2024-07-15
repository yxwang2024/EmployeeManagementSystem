import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        middleName: {
            type: String
        },
        preferredName: {
            type: String
        }
    },
    profilePicture: {
        type: String,
        default: 'placeholder'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    identity: {
        ssn: {
            type: String,
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
        }
    },
    currentAddress: {
        street: {
            type: String,
        },
        building: {
            type: String,
        },
        city: {
            type: String,

        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    contactInfo: {
        cellPhone: {
            type: String,
        },
        workPhone: {
            type: String
        }
    },
    employment: {
        visaTitle: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        }
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reference'
    },
    emergencyContacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyContacts'
    }],
    documents: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents'
    }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;