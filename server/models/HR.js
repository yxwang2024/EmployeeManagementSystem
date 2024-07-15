import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

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
    }
});

hrSchema.pre('save', async function (next) {
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

hrSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatched = await bcrypt.compare(candidatePassword, this.password);
        return isMatched;
    } catch (err) {
        return next(err);
    }
};

const HR = mongoose.model('HR', hrSchema);

export default HR;