const express = require('express');
const { protect, allowAccessTo } = require('../controller/authController');
const {
    createCategory,
    getAllCategories,
    editCategory,
} = require('../controller/categoryController');

const router = express.Router();

router.post('/', protect, allowAccessTo('admin'), createCategory);
router.get('/', getAllCategories);
router.put('/:id', protect, allowAccessTo('admin'), editCategory);
router.delete('/:id', protect, allowAccessTo('admin'), require('../controller/categoryController').deleteCategory);

module.exports = router;