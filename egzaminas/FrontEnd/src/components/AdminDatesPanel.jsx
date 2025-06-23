import { useEffect, useState } from 'react';

export default function AdminDatesPanel() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newDates, setNewDates] = useState({}); // { tourId: 'YYYY-MM-DD' }
  const [editDate, setEditDate] = useState({}); // { dateId: 'YYYY-MM-DD' }

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/tours');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko gauti ekskursijų');
      // For each tour, fetch dates
      const toursWithDates = await Promise.all(
        data.data.map(async (tour) => {
          const dRes = await fetch(`http://localhost:3000/api/v1/tours/${tour.id}/dates`);
          const dData = await dRes.json();
          return { ...tour, dates: dData.data || [] };
        })
      );
      setTours(toursWithDates);
    } catch (e) {
      setError(e.message || 'Serverio klaida');
    }
    setLoading(false);
  };

  const handleAddDate = async (tourId) => {
    setError(''); setSuccess('');
    const date = newDates[tourId];
    if (!date) return setError('Įveskite datą');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/${tourId}/datos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dates: [date] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko pridėti datos');
      setSuccess('Data pridėta');
      setNewDates(nd => ({ ...nd, [tourId]: '' }));
      fetchTours();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEditDate = async (dateId, tourId) => {
    setError(''); setSuccess('');
    const date = editDate[dateId];
    if (!date) return setError('Įveskite naują datą');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/datos/${dateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko redaguoti datos');
      setSuccess('Data atnaujinta');
      setEditDate(ed => ({ ...ed, [dateId]: '' }));
      fetchTours();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeleteDate = async (dateId) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/datos/${dateId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko ištrinti datos');
      setSuccess('Data ištrinta');
      fetchTours();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ekskursijų datų valdymas</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? <div className="text-white">Kraunama...</div> : (
        tours.map(tour => (
          <div key={tour.id} className="mb-8 p-4 bg-gray-900 rounded shadow border border-gray-700">
            <div className="font-semibold text-lg mb-2 text-white">{tour.title}</div>
            <div className="mb-2 text-sm text-gray-300">{tour.description}</div>
            <div className="mb-2">
              <span className="font-semibold text-white">Datos:</span>
              <ul className="ml-4 mt-1">
                {tour.dates.length === 0 && <li className="text-gray-400">Nėra datų</li>}
                {tour.dates.map(date => (
                  <li key={date.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="date"
                      className="border border-gray-600 rounded px-2 py-1 text-sm bg-gray-800 text-white"
                      value={editDate[date.id] !== undefined ? editDate[date.id] : date.tour_date?.slice(0, 10)}
                      onChange={e => setEditDate(ed => ({ ...ed, [date.id]: e.target.value }))}
                    />
                    <button className="text-blue-300 hover:underline text-xs" onClick={() => handleEditDate(date.id, tour.id)}>Išsaugoti</button>
                    <button className="text-red-400 hover:underline text-xs" onClick={() => handleDeleteDate(date.id)}>Ištrinti</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="date"
                className="border border-gray-600 rounded px-2 py-1 text-sm bg-gray-800 text-white"
                value={newDates[tour.id] || ''}
                onChange={e => setNewDates(nd => ({ ...nd, [tour.id]: e.target.value }))}
              />
              <button className="bg-green-700 text-white px-3 py-1 rounded text-sm hover:bg-green-800" onClick={() => handleAddDate(tour.id)}>Pridėti datą</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
