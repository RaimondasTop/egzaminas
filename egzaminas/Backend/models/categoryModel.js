const { sql } = require('../dbConnection');

exports.createCategory = async (name) => {
  try {
    const category = await sql`
      INSERT INTO categories (name)
      VALUES (${name})
      RETURNING *;
    `;
    return category[0];
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

exports.getAllCategories = async () => {
  try {
    const categories = await sql`
      SELECT id, name FROM categories;
    `;
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

exports.EditCategory = async (id, name) => {
  try {
    const updatedCategory = await sql`
      UPDATE categories
      SET name = ${name}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (updatedCategory.length === 0) {
      throw new Error("Category not found");
    }
    return updatedCategory[0];
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

exports.deleteCategory = async (id) => {
  try {
    const deletedCategory = await sql`
      DELETE FROM categories
      WHERE id = ${id}
      RETURNING *;
    `;
    if (deletedCategory.length === 0) {
      throw new Error("Category not found");
    }
    return deletedCategory[0];
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
