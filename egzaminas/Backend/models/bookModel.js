const { sql } = require("../dbConnection");

exports.createBook = async (newBook) => {
  const { title, author, description, category, photo_url } = newBook;
  const [book] = await sql`
    INSERT INTO books (title, author, description, category, photo_url)
    VALUES (${title}, ${author}, ${description}, ${category}, ${photo_url})
    RETURNING *;
  `;
  return book;
};

exports.getAllBooks = async () => {
  return await sql`
    SELECT 
      books.id,
      books.title,
      books.description,
      books.photo_url,
      books.author,
      books.is_reserved,
      books.category,
      categories.name AS category_name
    FROM books
    LEFT JOIN categories ON books.category = categories.id
  `;
};

// Get book by ID
exports.getBookByID = async (id) => {
  const [book] = await sql`
    SELECT 
      id, title, description, photo_url, author, is_reserved
    FROM books
    WHERE id = ${id}
  `;
  return book;
};

exports.deleteBook = async (id) => {
  const [deletedBook] = await sql`
    DELETE FROM books WHERE id = ${id} RETURNING *;
  `;
  if (!deletedBook) throw new Error("Book not found");
  return deletedBook;
};

exports.updateBookPart = async (id, updatedBook) => {
  const columns = Object.keys(updatedBook);
  const [book] = await sql`
    UPDATE books SET ${sql(updatedBook, columns)}
    WHERE id = ${id}
    RETURNING *;
  `;
  return book;
};

exports.filterBooks = async (filter) => {
  const validDirections = ["ASC", "DESC"];
  let sortDirection = "ASC";
  if (filter.sort && validDirections.includes(filter.sort.toUpperCase())) {
    sortDirection = filter.sort.toUpperCase();
  }

  const conditions = [];
  if (filter.title) {
    conditions.push(sql`books.title ILIKE ${"%" + filter.title + "%"}`);
  }
  if (filter.author) {
    conditions.push(sql`books.author ILIKE ${"%" + filter.author + "%"}`);
  }
  if (filter.is_reserved !== undefined) {
    if (filter.is_reserved === "true" || filter.is_reserved === "false") {
      conditions.push(sql`books.is_reserved = ${filter.is_reserved === "true"}`);
    }
  }
  if (filter.category) {
    const categoryId = parseInt(filter.category, 10);
    if (!isNaN(categoryId)) {
      conditions.push(sql`books.category = ${categoryId}`);
    }
  }

const whereClause = conditions.length
  ? sql`WHERE ${conditions.reduce((prev, curr, i) => i === 0 ? curr : sql`${prev} AND ${curr}`)}`
  : sql``;

  const orderBy = sortDirection === "DESC" ? sql`DESC` : sql`ASC`;

  try {
    return await sql`
      SELECT 
        books.id,
        books.title,
        books.description,
        books.photo_url,
        books.author,
        books.is_reserved,
        books.category,
        categories.name AS category_name
      FROM books
      LEFT JOIN categories ON books.category = categories.id
      ${whereClause}
      ORDER BY books.title ${orderBy}
    `;
  } catch (err) {
    console.error("Book filter SQL error:", err);
    throw err;
  }
};