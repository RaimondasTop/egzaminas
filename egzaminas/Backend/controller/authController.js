const argon2 = require("argon2");
const { createUser, getUserByEmail, getUserById } = require('../models/userModel');
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const sendTokenCookie = (token, res) => {
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,    };
    res.cookie('jwt', token, cookieOptions);
};

// User signup
exports.signup = async (req, res, next) => {
    try {
        const newUser = req.body;
        const hash = await argon2.hash(newUser.password);

        newUser.password = hash;

        const createdUser = await createUser(newUser);

        if (!createdUser) {
            return next(new AppError("User not created", 400));
        }

        const token = signToken(createdUser.id);

        sendTokenCookie(token, res);
        
        // Remove password before sending back to client
        const { password, ...userWithoutPassword } = createdUser;

        res.status(201).json({
            status: "success",
            data: userWithoutPassword,
        });
    } catch (error) {
        next(error);
    }
};

//2.Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Gauk vartotoją pagal el. paštą
        const user = await getUserByEmail(email);
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        // Tikrink slaptažodį
        const isPasswordCorrect = await argon2.verify(user.password, password);
        if (!isPasswordCorrect) {
            return next(new AppError("Incorrect password", 401));
        }

        // Generuok tokeną
        const token = signToken(user.id);
        sendTokenCookie(token, res);

        // Pašalink slaptažodį iš atsakymo
        user.password = undefined;

        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

exports.protect = async (req, res, next) => {
  try {
    console.log(req);
    let token = req.cookies?.jwt;

    if (!token) {
        return next(
        new AppError(
            "You are not logged in. Please log in to access this route.",
            401
            )
        );
        }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

//check if user still exists
const currentUser = await getUserById(decoded.id);
if (!currentUser) {
    return next(
        new AppError(
            "The user belonging to this token does no longer exist.",
            401
        )
        );
    }
    req.user = currentUser;

    next(); 
} catch (error) {
next(error);
}
};

exports.allowAccessTo = (...roles) => {
return (req, res, next) => {
    try {
    if (!roles.includes(req.user.role)) {
        throw new AppError(
        `You do not have permission to perform this action`,
        403
        );
    }
    next();
    } catch (error) {
    next(error);
    }
};
};

exports.logout = (req, res) => {
    return res.clearCookie('jwt').status(200).json({
        status: 'success',
        message: 'User logged out successfully',
    });
};

exports.logout = (req, res) => {
return res.clearCookie('jwt').status(200).json({
    message: "You are logged out",
});
};