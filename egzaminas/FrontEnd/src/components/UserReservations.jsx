import React, { useEffect, useState } from "react";

export default function UserReservations({ refresh, setRefresh }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [extendDate, setExtendDate] = useState({});
  const [extendMsg, setExtendMsg] = useState({});

  function getDaysLeft(returnDate) {
    const now = new Date();
    const end = new Date(returnDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return "Expired";
    if (diff === 0) return "Ending today";
    return `${diff} d. left`;
  }

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/v1/books/reservations", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Nepavyko gauti rezervacijų");
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (reservationId) => {
    if (!window.confirm("Ar tikrai norite ištrinti rezervaciją?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/books/reservations/${reservationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setRefresh((r) => r + 1);
      } else {
        alert("Klaida trinant rezervaciją");
      }
    } catch {
      alert("Serverio klaida trinant rezervaciją");
    }
  };

  const handleExtend = async (
    reservationId,
    currentReturnDate,
    currentExtendedTimes
  ) => {
    setExtendMsg({});
    if (currentExtendedTimes >= 2) {
      setExtendMsg((m) => ({
        ...m,
        [reservationId]: "Negalite daugiau pratęsti",
      }));
      return;
    }
    const newDate = extendDate[reservationId];
    if (!newDate) {
      setExtendMsg((m) => ({
        ...m,
        [reservationId]: "Pasirinkite naują datą",
      }));
      return;
    }
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (new Date(newDate) > maxDate) {
      setExtendMsg((m) => ({
        ...m,
        [reservationId]: "Galima pratęsti tik iki 30 dienų nuo šiandien",
      }));
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/books/reservations/${reservationId}/extend`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_return_date: newDate }),
        }
      );
      if (res.ok) {
        setExtendMsg((m) => ({ ...m, [reservationId]: "Pratęsta!" }));
        setRefresh((r) => r + 1);
      } else {
        const data = await res.json();
        setExtendMsg((m) => ({
          ...m,
          [reservationId]: data.message || "Klaida pratęsiant",
        }));
      }
    } catch {
      setExtendMsg((m) => ({ ...m, [reservationId]: "Serverio klaida" }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (reservations.length === 0) return <div>No reservations</div>;

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="my-6">
      <h2 className="text-lg font-bold mb-2">Your reservations</h2>
      <table className="w-full bg-white rounded shadow table-fixed">
        <thead>
          <tr>
            <th className="p-2 w-1/4 text-left">Book</th>
            <th className="p-2 w-1/5 text-left">Author</th>
            <th className="p-2 w-1/5 text-left">Return until</th>
            <th className="p-2 w-1/5 text-left">Time left</th>
            <th className="p-2 w-1/5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.reservation_id} className="border-t">
              <td className="p-2">{r.book_title}</td>
              <td className="p-2">{r.book_author}</td>
              <td className="p-2">
                {r.return_date
                  ? new Date(r.return_date).toLocaleDateString()
                  : ""}
                <br />
                <span className="text-xs text-gray-500">
                  Extended: {r.extended_times || 0} times
                </span>
              </td>
              <td className="p-2">{getDaysLeft(r.return_date)}</td>
              <td className="p-2">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded mb-1"
                  onClick={() => handleDelete(r.reservation_id)}
                >
                  Delete Reservation
                </button>
                <br />
                {r.extended_times < 2 && (
                  <div className="mt-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Extend return date:
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={extendDate[r.reservation_id] || ""}
                      onChange={(e) =>
                        setExtendDate((d) => ({
                          ...d,
                          [r.reservation_id]: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1 text-xs"
                    />
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded ml-1 text-xs"
                      onClick={() =>
                        handleExtend(
                          r.reservation_id,
                          r.return_date,
                          r.extended_times || 0
                        )
                      }
                    >
                      Extend
                    </button>
                    {extendMsg[r.reservation_id] && (
                      <div className="text-xs text-red-500">
                        {extendMsg[r.reservation_id]}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      No more than {2 - (r.extended_times || 0)} times
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
