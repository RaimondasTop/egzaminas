const { sql } = require('../dbConnection');

// Register a user for a tour on a specific date
exports.registerForTour = async ({ user_id, tour_id, tour_date_id }) => {
  // Check if already registered
  const existing = await sql`
    SELECT * FROM tour_registrations WHERE user_id = ${user_id} AND tour_date_id = ${tour_date_id}
  `;
  if (existing.length > 0) {
    throw new Error('Jau užsiregistravote šiai ekskursijai šiai datai');
  }
  // Insert registration
  const result = await sql`
    INSERT INTO tour_registrations (user_id, tour_id, tour_date_id)
    VALUES (${user_id}, ${tour_id}, ${tour_date_id})
    RETURNING *;
  `;
  return result[0];
};

// Get available dates for a tour
exports.getTourDates = async (tour_id) => {
  const dates = await sql`
    SELECT * FROM tour_dates WHERE tour_id = ${tour_id} ORDER BY tour_date ASC
  `;
  return dates;
};

// Delete a user's registration for a tour (by registration id and user id)
exports.deleteRegistration = async ({ user_id, registration_id }) => {
  const result = await sql`
    DELETE FROM tour_registrations WHERE id = ${registration_id} AND user_id = ${user_id} RETURNING *;
  `;
  return result[0];
};

// Update a user's registration date (by registration id and user id)
exports.updateRegistrationDate = async ({ user_id, registration_id, new_tour_date_id }) => {
  const result = await sql`
    UPDATE tour_registrations SET tour_date_id = ${new_tour_date_id} WHERE id = ${registration_id} AND user_id = ${user_id} RETURNING *;
  `;
  return result[0];
};

// Gauti visus dalyvius pagal ekskursiją (arba visus)
exports.getAllRegistrations = async (tour_id = null) => {
  let registrations;
  // Užtikrinam, kad tour_id tikrai skaičius, kitaip - null
  if (typeof tour_id !== 'number' || !Number.isInteger(tour_id) || tour_id <= 0) {
    tour_id = null;
  }
  if (tour_id) {
    registrations = await sql`
      SELECT r.id, u.username, u.email, d.tour_date, r.is_confirmed
      FROM tour_registrations r
      JOIN users u ON r.user_id = u.id
      JOIN tour_dates d ON r.tour_date_id = d.id
      WHERE r.tour_id = ${tour_id}
      ORDER BY d.tour_date ASC
    `;
  } else {
    registrations = await sql`
      SELECT r.id, u.username, u.email, d.tour_date, r.is_confirmed, r.tour_id
      FROM tour_registrations r
      JOIN users u ON r.user_id = u.id
      JOIN tour_dates d ON r.tour_date_id = d.id
      ORDER BY d.tour_date ASC
    `;
  }
  return registrations;
};

// Patvirtinti arba atmesti registraciją
exports.setRegistrationStatus = async (registration_id, is_confirmed) => {
  const result = await sql`
    UPDATE tour_registrations SET is_confirmed = ${is_confirmed} WHERE id = ${registration_id} RETURNING *;
  `;
  return result[0];
};
