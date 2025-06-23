import { useEffect, useState } from 'react';

export default function RegisterModal({ tourId, onClose, onSuccess }) {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3000/api/v1/tours/${tourId}/dates`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Nepavyko gauti datų');
        } else {
          setDates(data.data || []);
        }
      } catch {
        setError('Serverio klaida');
      }
      setLoading(false);
    };
    fetchDates();
  }, [tourId]);

  const handleRegister = async () => {
    if (!selectedDate) return setError('Pasirinkite datą');
    setSubmitting(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`http://localhost:3000/api/v1/tours/${tourId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tour_date_id: selectedDate })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registracijos klaida');
      } else {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch {
      setError('Serverio klaida');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4 text-center">Pasirinkite datą</h2>
        {loading ? <div>Kraunama...</div> : (
          <>
            <select
              className="w-full border border-gray-400 rounded px-3 py-2 mb-4 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            >
              <option value="">-- Pasirinkite datą --</option>
              {dates.map(date => (
                <option key={date.id} value={date.id}>{date.tour_date?.slice(0, 10)}</option>
              ))}
            </select>
            {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
            <button
              className={`rounded px-4 py-2 w-full mb-2 font-semibold transition ${submitting ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              onClick={handleRegister}
              disabled={submitting}
            >
              Užsirašyti
            </button>
            <button className="text-gray-500 hover:underline w-full text-center" onClick={onClose}>Atšaukti</button>
          </>
        )}
      </div>
    </div>
  );
}
