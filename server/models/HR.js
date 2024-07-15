import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const hrSchema = new Schema({
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
    },
    mailHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MailHistory',
        required: true
    }
});

const HR = mongoose.model('HR', hrSchema);

export default HR;