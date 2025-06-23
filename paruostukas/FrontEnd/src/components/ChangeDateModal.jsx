import { useEffect, useState } from 'react';

export default function ChangeDateModal({ registrationId, currentTourId, currentDateId, onClose, onSuccess }) {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currentDateId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:3000/api/v1/tours/${currentTourId}/dates`);
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
  }, [currentTourId]);

  const handleChangeDate = async () => {
    if (!selectedDate) return setError('Pasirinkite naują datą');
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/registration/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_tour_date_id: selectedDate })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Nepavyko pakeisti datos');
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-xs flex flex-col items-center border border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-center text-white">Keisti ekskursijos datą</h2>
        {loading ? <div className="text-gray-200">Kraunama...</div> : (
          <>
            <select
              className="w-full border border-gray-600 rounded px-3 py-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            >
              <option value="">-- Pasirinkite naują datą --</option>
              {dates.map(date => (
                <option key={date.id} value={date.id}>{date.tour_date?.slice(0, 10)}</option>
              ))}
            </select>
            {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
            <button
              className={`rounded px-4 py-2 w-full mb-2 font-semibold transition ${submitting ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={handleChangeDate}
              disabled={submitting}
            >
              Keisti datą
            </button>
            <button className="text-gray-400 hover:underline w-full text-center" onClick={onClose}>Atšaukti</button>
          </>
        )}
      </div>
    </div>
  );
}
