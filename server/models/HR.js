const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
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

module.exports = HR;
