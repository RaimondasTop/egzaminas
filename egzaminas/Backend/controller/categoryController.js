const { sql } = require('../dbConnection');
const { createCategory, getAllCategories, EditCategory, deleteCategory } = require('../models/categoryModel');
const AppError = require('../utils/appError');

exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new AppError("Category name is required", 400));
        }

        const newCategory = await createCategory(name);
        res.status(201).json({
            status: "success",
            data: newCategory,
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json({
            status: "success",
            data: categories,
        });
    } catch (error) {
        next(error);
    }
}
exports.editCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return next(new AppError("Category name is required", 400));
        }

        const updatedCategory = await EditCategory(id, name);
        res.status(200).json({
            status: "success",
            data: updatedCategory,
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCategory = await deleteCategory(id);
        res.status(200).json({
            status: "success",
            data: deletedCategory,
        });
    } catch (error) {
        next(error);
    }
}