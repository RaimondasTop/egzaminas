import React, { useState, useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:3000/api/v1/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch users");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchUsers();
      else alert("Error deleting user");
    } catch {
      alert("Server error deleting user");
    }
  };

  const validateForm = (f, isEdit = false) => {
    if (!f.username || f.username.length < 3) return "Username is required and must be at least 3 characters.";
    if (!f.email || !f.email.includes("@")) return "Valid email is required.";
    if (!isEdit && (!f.password || f.password.length < 6)) return "Password is required and must be at least 6 characters.";
    if (f.password && f.password.length > 0 && f.password.length < 6) return "Password must be at least 6 characters.";
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
      const res = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAdd(false);
        setForm({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        setError(data.message || "Error adding user");
      }
    } catch {
      setError("Server error adding user");
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowEdit(true);
    setError("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const validationError = validateForm(form, true);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    const dataToSend = { ...form };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/users/${editUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowEdit(false);
        setEditUser(null);
        setForm({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        setError(data.message || "Error editing user");
      }
    } catch {
      setError("Server error editing user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !showAdd && !showEdit) return <div className="text-red-500">{error}</div>;

  return (
    <section className="py-8 px-4 w-full">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <button
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded-b-3xl"
        onClick={() => { setShowAdd(true); setError(""); }}
      >
        Add New User
      </button>
      <table className="w-full bg-white rounded shadow table-fixed">
        <thead>
          <tr>
            <th className="p-2 w-1/4 text-left">Name</th>
            <th className="p-2 w-1/4 text-left">Email</th>
            <th className="p-2 w-1/4 text-left">Role</th>
            <th className="p-2 w-1/4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2 text-left">{user.username}</td>
              <td className="p-2 text-left">{user.email}</td>
              <td className="p-2 text-left">{user.role}</td>
              <td className="p-2 text-left">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => openEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
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
            <h2 className="text-xl font-bold mb-2 text-center">
              Add User
            </h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
              className="border rounded px-3 py-2"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="border rounded px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded flex-1"
              >
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
            <h2 className="text-xl font-bold mb-2 text-center">
              Edit User
            </h2>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="New Password (leave blank if not changing)"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="border rounded px-3 py-2"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="border rounded px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-yellow-500 text-white px-4 py-2 rounded flex-1"
              >
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