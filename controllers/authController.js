const { promisify } = require('util');
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require('jsonwebtoken');
const AppError = require("./../utils/appError");
// const bcrypt = require('bcryptjs');
// const sendEmail = require('./../utils/email');
// const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    // Remove the password from the response.
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password
    });

    createSendToken(newUser, 201, res);
});

exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password.', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    //  Checking that there's a token in the header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in!', 401));
    }

    // Verification of the token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Checking if the user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'This user no longer exists',
                401
            )
        );
    }

    // // Checking if the user has changed the password.
    if (await currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Login again', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
});

// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new AppError('You are restricted from using this resource', 403));
//         }

//         next();
//     }
// }

// exports.forgotPassword = async (req, res, next) => {
//     // 1. Get the user by email
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return next(new AppError('There is no such user', 404));
//     }

//     // 2. Generate random token
//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     // 3. Send it to the user through email
//     const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

//     const message = `Forgot Password? change at ${resetURL}`;

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Password reset token only valid for 10 mins',
//             message
//         });

//         res.status(200).json({
//             status: 'success',
//             message: 'Token sent to email',
//         });
//     } catch (error) {
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new AppError('There was an error sending email try again later.', 500))
//     }
// }

// exports.resetPassword = catchAsync(async (req, res, next) => {
//     // 1. Get user based on token
//     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
//     const user = await User.findOne({
//         passwordResetToken: hashedToken,
//         passwordResetExpires: { $gt: Date.now() }
//     });

//     // 2. If the token hasn't expired
//     if (!user) {
//         return next(new AppError('Token is invalid or has expired', 400));
//     }

//     // 3. Update changedPasswordAt.
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();

//     // 4. Log the user in.
//     createSendToken(user, 200, res);
// });

// exports.updatePassword = async (req, res, next) => {
//     const user = await User.findById(req.user.id).select('+password');

//     if (!user || !(await user.comparePassword(req.body.password, user.password))) {
//         return next(new AppError('Your current password is wrong', 401));
//     }

//     user.password = req.body.newPassword;
//     user.passwordConfirm = req.body.passwordConfirm;
//     await user.save();

//     createSendToken(user, 200, res);
// }