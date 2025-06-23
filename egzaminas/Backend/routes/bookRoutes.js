const express = require('express');
const validateNewBook = require('../validator/newBook');
const validate = require('../validator/validate');
const { protect, allowAccessTo } = require('../controller/authController');
const {
  createBook,
  getBooks,
  getOneBook,
  updateBook,
  getFilteredBooks,
  deleteBook,
  ReserveBook,
  deleteReservation,
  getAllReservations,
  extendReservation
} = require('../controller/bookController');

const router = express.Router();

router
  .route('/')
  .post(protect, allowAccessTo('admin'), validateNewBook, validate, createBook)
  .get(getBooks);

router.get('/filter', getFilteredBooks);

router
  .route('/')
  .post(protect, allowAccessTo('admin'), validateNewBook, validate, createBook)
  .get(getBooks);
router.post('/:bookId/reserve', protect, ReserveBook);
router.get('/reservations', protect, getAllReservations);
router.delete('/reservations/:reservationId', protect, deleteReservation);
router.patch('/reservations/:reservationId/extend', protect, extendReservation);

router
  .route('/:id')
  .get(getOneBook)
  .put(protect, allowAccessTo('admin'), updateBook)
  .delete(protect, allowAccessTo('admin'), deleteBook);

module.exports = router;