const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,

    },
    role: {
        type: String,
        enum: ['admin', 'user', 'super_admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;