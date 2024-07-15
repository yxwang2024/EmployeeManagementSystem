const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true
    },
    name: {
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
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            required: true
        }
    },
    currentAddress: {
        buildingApt: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        }
    },
    contactInfo: {
        cellPhone: {
            type: String,
            required: true
        },
        workPhone: {
            type: String
        }
    },
    employment: {
        visaTitle: {
            type: String
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
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

module.exports = Profile;
