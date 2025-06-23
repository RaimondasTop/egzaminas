const express = require('express');
const { protect, allowAccessTo } = require('../controller/authController');
const {
    getUsers,
    createUser,
    deleteUser,
    editUser
} = require('../controller/userController');

const router = express.Router();

router
    .route('/')
    .get(protect, allowAccessTo('admin'), getUsers)
    .post(protect, allowAccessTo('admin'), createUser);

router
    .route('/:id')
    .delete(protect, allowAccessTo('admin'), deleteUser)
    .patch(protect, allowAccessTo('admin'), editUser);

module.exports = router;