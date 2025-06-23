import { useEffect, useState } from 'react';

export default function AdminRegistrationsPanel() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterTourId, setFilterTourId] = useState('');
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
    fetchRegistrations();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/tours');
      const data = await res.json();
      if (res.ok) setTours(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchRegistrations = async (tourId) => {
    setLoading(true);
    setError('');
    try {
      let url = 'http://localhost:3000/api/v1/tours/registrations';
      if (typeof tourId === 'number') url += `?tour_id=${tourId}`;
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko gauti dalyvių');
      setRegistrations(data.data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleStatus = async (registrationId, is_confirmed) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_confirmed })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Nepavyko atnaujinti');
      setSuccess(is_confirmed ? 'Dalyvis patvirtintas' : 'Dalyvis atmestas');
      fetchRegistrations(filterTourId);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dalyvių sąrašas</h1>
      <div className="mb-4 flex gap-2 items-center">
        <label className="text-sm font-semibold text-gray-700">Filtruoti pagal ekskursiją:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filterTourId}
          onChange={e => {
            const val = e.target.value;
            setFilterTourId(val);
            fetchRegistrations(val ? Number(val) : undefined);
          }}
        >
          <option value="">Visos ekskursijos</option>
          {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {loading ? <div className="text-white">Kraunama...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded shadow border border-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-2 border-b border-gray-700">Vardas</th>
                <th className="px-3 py-2 border-b border-gray-700">El. paštas</th>
                <th className="px-3 py-2 border-b border-gray-700">Data</th>
                <th className="px-3 py-2 border-b border-gray-700">Patvirtinta</th>
                <th className="px-3 py-2 border-b border-gray-700">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-4">Nėra dalyvių</td></tr>
              )}
              {registrations.map(r => (
                <tr key={r.id} className="border-b border-gray-800">
                  <td className="px-3 py-2">{r.username}</td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.tour_date?.slice(0,10)}</td>
                  <td className="px-3 py-2">{r.is_confirmed === null ? 'Laukia' : r.is_confirmed ? 'Taip' : 'Ne'}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      disabled={r.is_confirmed === true}
                      onClick={() => handleStatus(r.id, true)}
                    >Patvirtinti</button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      disabled={r.is_confirmed === false}
                      onClick={() => handleStatus(r.id, false)}
                    >Atmesti</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
