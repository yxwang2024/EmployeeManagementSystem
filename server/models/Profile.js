import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const emergencyContactSchema = new Schema({
    firstName: {
        type: String,
            default:'',
        required: true
    },
    lastName: {
        type: String,
            default:'',
        required: true
    },
    middleName: {
        type: String
    },
    phone: {
        type: String,
            default:'',
    },
    email: {
        type: String,
            default:'',
    },
    relationship: {
        type: String,
            default:'',
        required: true
    }
});

const profileSchema = new Schema({
    name: {
        firstName: {
            type: String,
            default:'',
        },
        lastName: {
            type: String,
            default:'',
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
            default:'',
        required: true,
        unique: true
    },
    identity: {
        ssn: {
            type: String,
            default:'',
        },
        dob: {
            type: Date,
            default:'2024-07-24',
        },
        gender: {
            type: String,
            default:'',
        }
    },
    currentAddress: {
        street: {
            type: String,
            default:'',
        },
        building: {
            type: String,
            default:'',
        },
        city: {
            type: String,
            default:'',

        },
        state: {
            type: String,
            default:'',
        },
        zip: {
            type: String,
            default:'',
        }
    },
    contactInfo: {
        cellPhone: {
            type: String,
            default:'',
        },
        workPhone: {
            type: String
        }
    },
    employment: {
        visaTitle: {
            type: String,
            default:'',
        },
        startDate: {
            type: Date,
            default:'2000-01-01',
        },
        endDate: {
            type: Date,
            default:'2000-01-01',
        }
    },
    reference: {
        firstName: {
            type: String,
            default:'',
        },
        lastName: {
            type: String,
            default:'',
        },
        middleName: {
            type: String,
            default:'',
        },
        phone: {
            type: String,
            default:'',
        },
        email: {
            type: String,
            default:'',
        },
        relationship: {
            type: String,
            default:'',
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