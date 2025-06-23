const { sql } = require('../dbConnection');
const { createBook, getAllBooks, getBookByID, updateBookPart, filterBooks } = require('../models/bookModel');
const { reserveBook, deleteReservation, getReservationsByUser, extendReservation } = require('../models/bookRegistrationModel');
const AppError = require('../utils/appError');

exports.createBook = async (req, res, next) => {
  try {
    const newBook = req.body;
    const createdBook = await createBook(newBook);
    res.status(201).json({ status: "success", data: createdBook });
  } catch (error) {
    next(error);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await getAllBooks();
    if (!books.length) return next(new AppError('No Books found', 404));
    res.status(200).json({ status: 'success', resultsCount: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await getBookByID(id);
    if (!book) return next(new AppError('Invalid Book ID', 404));
    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBook = await updateBookPart(id, req.body);
    if (!updatedBook) return next(new AppError('Invalid Book ID', 404));
    res.status(200).json({ status: "success", data: updatedBook });
  } catch (error) {
    next(error);
  }
};

exports.getFilteredBooks = async (req, res, next) => {
  try {
    const filter = req.query;
    const allowedFields = ["title", "author", "category", "is_reserved", "sort"];
    for (const key of Object.keys(filter)) {
      if (!allowedFields.includes(key)) {
        return next(new AppError(
          `Invalid field '${key}'. Allowed fields are: ${allowedFields.join(", ")}`,
          400
        ));
      }
    }
    const books = await filterBooks(filter);
    res.status(200).json({ status: "success", data: books });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await sql`DELETE FROM Books WHERE id = ${id} RETURNING *;`;
    if (!deleted[0]) {
      return res.status(404).json({ status: 'fail', message: 'Ekskursija nerasta' });
    }
    res.status(200).json({ status: 'success', data: deleted[0] });
  } catch (error) {
    next(error);
  }
};

exports.ReserveBook = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const book_id = parseInt(req.params.bookId);
    const { return_date } = req.body;
    const reserved = await reserveBook({ user_id, book_id, return_date });
    res.status(201).json({ status: 'success', data: reserved });
  } catch (error) {
    next(error);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reservation_id = parseInt(req.params.reservationId);
    const deleted = await deleteReservation({ user_id, reservation_id });
    res.status(200).json({ status: 'success', data: deleted });
  } catch (error) {
    next(error);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reservations = await getReservationsByUser(user_id);
    res.status(200).json({ status: 'success', data: reservations });
  } catch (error) {
    next(error);
  }
}

exports.extendReservation = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reservation_id = parseInt(req.params.reservationId);
    const new_return_date = req.body.new_return_date;

    if (!new_return_date) {
      return next(new AppError('New return date is required', 400));
    }

    const extended = await extendReservation({ user_id, reservation_id, new_return_date });
    res.status(200).json({ status: 'success', data: extended });
  } catch (error) {
    next(error);
  }
};


