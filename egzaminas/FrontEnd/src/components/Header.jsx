import React from "react";

export default function Header({ user, onLogin, onRegister, onLogout }) {
  return (
    <header className="bg-amber-800 text-white py-4 px-6 flex justify-between items-center shadow">
      <div className="text-xl font-bold">Knygų rezervacija</div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>
              Logged in as: <b>{user.name || user.username}</b>
              {user.role === "admin" && " (admin)"}
            </span>
            <button
              className="bg-red-600 hover:bg-red-700 px-3 py- rounded-3xl text-white"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              onClick={onLogin}
            >
              Login
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              onClick={onRegister}
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}