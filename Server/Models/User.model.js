const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: [true, 'First name is required'],
            minlength: [3, 'The first name must be at least 3 characters long'],
            trim: true
        },
        lastname: {
            type: String,
            required: [true, 'Last name is required'],
            minlength: [3, 'The last name must be at least 3 characters long'],
            trim: true
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.ComparePassword = async function(enteredPassword) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
