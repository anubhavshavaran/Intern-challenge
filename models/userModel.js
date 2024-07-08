const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (val) {
                return val.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/);
            },
            message: 'Invalid email address!'
        }
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        min: [8, "Minimum 8 characters are required."],
        select: false
    },
    score: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    joined: {
        type: Date,
        default: Date.now()
    },
    passwordChangedAt: {
        type: Date,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    // Only runs if the password was modified.
    if (!this.isModified('password')) return next();

    // Hashes the password.
    this.password = await bcrypt.hash(this.password, 12);

    // Deletes the password confirm field.
    this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedAttimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedAttimeStamp;
    }

    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;