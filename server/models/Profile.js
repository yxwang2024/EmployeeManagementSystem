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
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        middleName: {
            type: String
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        relationship: {
            type: String,
        }
    },
    emergencyContacts: {
        type: [emergencyContactSchema],
    },
    documents: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
        }],
        default: [],
    }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;