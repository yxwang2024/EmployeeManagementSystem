import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
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
    role: {
        type: String,
        enum: ['Employee', 'HR'],
        required: true
    },
    instance: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
      },

});

userSchema.pre('save', async function (next) {
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

userSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        let isMatched = await bcrypt.compare(candidatePassword, this.password);
        return isMatched;
    } catch (err) {
        return next(err);
    }
};

const User = mongoose.model('User', userSchema);

export default User;