import React, { useState, useEffect } from "react";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editBook, setEditBook] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    photo_url: "",
    category: "",
  });

  const fetchBooks = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/v1/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Nepavyko gauti knygų sąrašo");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Ar tikrai norite Delete šią knygą?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/books/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchBooks();
      else alert("Klaida trinant knygą");
    } catch {
      alert("Serverio klaida trinant knygą");
    }
  };

  const validateForm = (f) => {
    if (!f.title || f.title.length < 3) return "Title is required and must be at least 3 characters.";
    if (!f.author) return "Author is required.";
    if (!f.category || isNaN(Number(f.category))) return "Category ID is required and must be a number.";
    if (f.photo_url && !/^https?:\/\/.+\..+/.test(f.photo_url)) return "Photo URL must be valid (http(s)://...)";
    return "";
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/v1/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAdd(false);
        setForm({ title: "", author: "", description: "", photo_url: "", category: "" });
        fetchBooks();
      } else {
        setError(data.message || "Klaida pridedant knygą");
      }
    } catch {
      setError("Serverio klaida pridedant knygą");
    }
  };

  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      photo_url: book.photo_url,
      category: book.category,
    });
    setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/api/v1/books/${editBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEdit(false);
        setEditBook(null);
        setForm({ title: "", author: "", description: "", photo_url: "", category: "" });
        fetchBooks();
      } else {
        setError(data.message || "Klaida redaguojant knygą");
      }
    } catch {
      setError("Serverio klaida redaguojant knygą");
    }
  };

  if (loading) return <div>Kraunama...</div>;
  if (error && !showAdd && !showEdit) return <div className="text-red-500">{error}</div>;

  return (
    <section className="py-8 px-4 w-full">
      <h2 className="text-xl font-bold mb-4">Book Management</h2>
      <button
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded-b-3xl"
        onClick={() => { setShowAdd(true); setError(""); }}
      >
        Add new book
      </button>
      <table className="w-full bg-white rounded shadow table-fixed">
        <thead>
          <tr>
            <th className="p-2 w-1/4 text-left">Name</th>
            <th className="p-2 w-1/4 text-left">Author</th>
            <th className="p-2 w-1/4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="p-2 w-1/4 text-left">{book.title}</td>
              <td className="p-2 w-1/4 text-left">{book.author}</td>
              <td className="p-2 w-1/4 text-left">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => { openEdit(book); setError(""); }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(book.id)}
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
            <h2 className="text-xl font-bold mb-2 text-center">Add Book</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={form.photo_url}
              onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Category (ID)"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
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
            <h2 className="text-xl font-bold mb-2 text-center">Edit Book</h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={form.photo_url}
              onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Category (ID)"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
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