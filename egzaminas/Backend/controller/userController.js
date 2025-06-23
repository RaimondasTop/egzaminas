const { sql } = require('../dbConnection');
const AppError = require('../utils/appError');
const { createUser, deleteUser, getUsers, editUser } = require('../models/userModel');
const argon2 = require("argon2"); 

exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return next(new AppError("Username, email, and password are required", 400));
        }

        const hashedPassword = await argon2.hash(password);

        const userToCreate = {
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        };

        const createdUser = await createUser(userToCreate);
        res.status(201).json({
            status: "success",
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUser(id);
        res.status(200).json({
            status: "success",
            data: deletedUser,
        });
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const users = await getUsers();
        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

exports.editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedUser = { ...req.body };

        if (updatedUser.password) {
            updatedUser.password = await argon2.hash(updatedUser.password);
        }

        const user = await editUser(id, updatedUser);
        res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}