const { sql } = require("../dbConnection");

exports.reserveBook = async ({ user_id, book_id, return_date }) => {
  const existing = await sql`
    SELECT * FROM reservations WHERE user_id = ${user_id} AND book_id = ${book_id}
  `;
  if (existing.length > 0) {
    throw new Error("Jau uzrezervave šia knyga");
  }
  const result = await sql`
    INSERT INTO reservations (user_id, book_id, return_date)
    VALUES (${user_id}, ${book_id}, ${return_date})
    RETURNING *;
  `;
  await sql`
    UPDATE books SET is_reserved = true WHERE id = ${book_id};
  `;
  return result[0];
};

exports.deleteReservation = async ({ user_id, reservation_id }) => {
  const result = await sql`
    DELETE FROM reservations WHERE id = ${reservation_id} AND user_id = ${user_id} RETURNING *;
  `;
  if (!result[0]) throw new Error("Reservation not found or not yours");
  await sql`
    UPDATE books SET is_reserved = false WHERE id = ${result[0].book_id};
  `;
  return result[0];
};

exports.getReservationsByUser = async (user_id) => {
  const reservations = await sql`
SELECT
  reservations.id AS reservation_id,
  reservations.return_date,
  reservations.extended_times, -- this is important!
  books.title AS book_title,
  books.author AS book_author
FROM reservations
JOIN books ON reservations.book_id = books.id
WHERE reservations.user_id = ${user_id}
  `;
  return reservations;
};

exports.extendReservation = async ({
  user_id,
  reservation_id,
  new_return_date,
}) => {
  const result = await sql`
    UPDATE reservations
    SET return_date = ${new_return_date}
    WHERE id = ${reservation_id} AND user_id = ${user_id}
    RETURNING *;
  `;
  await sql`
  UPDATE reservations SET extended_times = extended_times + 1
  WHERE id = ${reservation_id} AND user_id = ${user_id};
  `;
  return result[0];
};
