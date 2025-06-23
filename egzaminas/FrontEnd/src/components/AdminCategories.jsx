import React, { useState, useEffect } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Nepavyko gauti kategorijų sąrašo");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.length < 2) {
      setError("Category name is required and must be at least 2 characters.");
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAdd(false);
        setForm({ name: "" });
        fetchCategories();
      } else {
        setError(data.message || "Klaida pridedant kategoriją");
      }
    } catch {
      setError("Serverio klaida pridedant kategoriją");
    }
  };

  const openEdit = (category) => {
    setEditCategory(category);
    setForm({ name: category.name });
    setShowEdit(true);
    setError("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.length < 2) {
      setError("Category name is required and must be at least 2 characters.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/api/v1/categories/${editCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEdit(false);
        setEditCategory(null);
        setForm({ name: "" });
        fetchCategories();
      } else {
        setError(data.message || "Error editing category");
      }
    } catch {
      setError("Server error editing category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchCategories();
      else alert("Error deleting category");
    } catch {
      alert("Server error deleting category");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !showAdd && !showEdit) return <div className="text-red-500">{error}</div>;

  return (
    <section className="py-8 px-4 w-full">
      <h2 className="text-xl font-bold mb-4">Category Management</h2>
      <button
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded-b-3xl"
        onClick={() => { setShowAdd(true); setError(""); }}
      >
        Add New Category
      </button>
      <table className="w-full bg-white rounded shadow table-fixed">
        <thead>
          <tr>
            <th className="p-2 w-1/4 text-left">Name</th>
            <th className="p-2 w-1/4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-2 w-1/4 text-left">{cat.name}</td>
              <td className="p-2 w-1/4 text-left">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => openEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleAdd}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-3"
          >
            <h2 className="text-xl font-bold mb-2 text-center">Add Category</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">
                Add
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded flex-1"
                onClick={() => { setShowAdd(false); setError(""); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form
            onSubmit={handleEdit}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-3"
          >
            <h2 className="text-xl font-bold mb-2 text-center">Edit Category</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded flex-1">
                Save
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded flex-1"
                onClick={() => { setShowEdit(false); setError(""); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}