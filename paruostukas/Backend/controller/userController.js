const { sql } = require('../dbConnection');

// Grąžina visas ekskursijas, į kurias useris užsirašė
exports.getMyTours = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const registrations = await sql`
      SELECT tr.id as registration_id, t.*, td.tour_date, tr.is_confirmed, tr.comment, tr.rating
      FROM tour_registrations tr
      JOIN tour_dates td ON tr.tour_date_id = td.id
      JOIN tours t ON td.tour_id = t.id
      WHERE tr.user_id = ${userId}
      ORDER BY td.tour_date DESC
    `;
    res.status(200).json({ status: 'success', data: registrations });
  } catch (error) {
    next(error);
  }
};
