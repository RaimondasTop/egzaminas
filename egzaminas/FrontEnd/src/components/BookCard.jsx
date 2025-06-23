import React, { useState } from "react";

export default function BookCard({ book, user, setRefresh }) {
  const [showReserve, setShowReserve] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [message, setMessage] = useState("");

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

    const handleReserve = async () => {
    setMessage("");
    if (!returnDate) {
      setMessage("Pasirinkite grąžinimo datą");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/v1/books/${book.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ return_date: returnDate }),
      });
      if (res.ok) {
        setMessage("Rezervuota sėkmingai!");
        setShowReserve(false);
        if (setRefresh) setRefresh(r => r + 1);
      } else {
        const data = await res.json();
        setMessage(data.message || "Rezervacijos klaida");
      }
    } catch {
      setMessage("Serverio klaida");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4 flex gap-4 items-center">
      {book.photo_url && (
        <img
          src={book.photo_url}
          alt={book.title}
          className="w-24 h-32 object-cover rounded"
        />
      )}
      <div>
        <h2 className="text-lg font-bold">{book.title}</h2>
        <p className="text-gray-700 mb-1">Author: {book.author}</p>
        <p className="text-gray-600 mb-1">{book.description}</p>
        <p className="text-gray-600 mb-1">
          Category: {book.category_name || "Nenurodyta"}
        </p>
        <p className="text-sm text-gray-500">
          {book.is_reserved ? "Reserved" : "Free"}
        </p>
        {!book.is_reserved && user && (
          <>
            {!showReserve ? (
              <button
                className="bg-cyan-400 text-white px-4 py-2 rounded-b-4xl mt-2"
                onClick={() => setShowReserve(true)}
              >
                Reserve
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={handleReserve}
                >
                  Patvirtinti rezervaciją
                </button>
                <button
                  className="text-gray-500 underline text-sm"
                  onClick={() => setShowReserve(false)}
                >
                  Atšaukti
                </button>
                {message && <div className="text-red-500">{message}</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}