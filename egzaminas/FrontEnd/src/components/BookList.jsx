import React, { useEffect, useState, useRef } from "react";
import BookCard from "./BookCard";

export default function BookList({ user, refresh, setRefresh }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    title: "",
    author: "",
    category: "",
    sort: "ASC",
  });
  const [categories, setCategories] = useState([]);
  const debounceRef = useRef();

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (filter.title) params.append("title", filter.title);
      if (filter.author) params.append("author", filter.author);
      if (filter.category) params.append("category", filter.category);
      if (filter.sort) params.append("sort", filter.sort);

      const isAllEmpty =
        !filter.title && !filter.author && !filter.category && (!filter.sort || filter.sort === "ASC");

      fetch(
        isAllEmpty
          ? "http://localhost:3000/api/v1/books"
          : `http://localhost:3000/api/v1/books/filter?${params.toString()}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBooks(data.data || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Nepavyko gauti knygų sąrašo");
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [refresh, filter]);

  const handleInput = (e) => {
    setFilter((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          name="title"
          placeholder="Search by name"
          value={filter.title}
          onChange={handleInput}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filter.author}
          onChange={handleInput}
          className="border rounded px-2 py-1"
        />
        <select
          name="category"
          value={filter.category}
          onChange={handleInput}
          className="border rounded px-2 py-1"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          name="sort"
          value={filter.sort}
          onChange={handleInput}
          className="border rounded px-2 py-1"
        >
          <option value="ASC">Sort: A-Z</option>
          <option value="DESC">Sort: Z-A</option>
        </select>
        <button
          className="bg-gray-300 px-2 py-1 rounded"
          onClick={() =>
            setFilter({ title: "", author: "", category: "", sort: "ASC" })
          }
        >
          Clear
        </button>
      </div>
      {books.length === 0 && <div>No books</div>}
      {books.map((book) => (
        <BookCard key={book.id} book={book} user={user} setRefresh={setRefresh} />
      ))}
    </div>
  );
}