import { useState, useEffect } from 'react';
import AdminTourForm from './AdminTourForm.jsx';

export default function AdminPanel() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTour, setEditTour] = useState(null);

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/tours');
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Nepavyko gauti ekskursijų');
      else setTours(data.data || []);
    } catch {
      setError('Serverio klaida');
    }
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Ar tikrai ištrinti ekskursiją?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) fetchTours();
      else alert('Nepavyko ištrinti');
    } catch {
      alert('Serverio klaida');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => { setEditTour(null); setShowForm(true); }}>+ Nauja ekskursija</button>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 w-full max-w-xs mx-auto">
            <h2 className="text-lg font-bold text-blue-700">{tour.title || tour.name}</h2>
            <div className="text-gray-600">{tour.description}</div>
            <div className="flex gap-2 text-sm mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Kaina: {tour.price} €</span>
              {tour.duration_minutes && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Trukmė: {tour.duration_minutes} min</span>}
              {tour.duration && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Trukmė: {tour.duration} min</span>}
            </div>
            {tour.photo_url && <img src={tour.photo_url} alt={tour.title} className="w-full h-32 object-cover rounded mt-2" />}
            <div className="flex gap-2 mt-2">
              <button className="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600 transition" onClick={() => { setEditTour(tour); setShowForm(true); }}>Redaguoti</button>
              <button className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition" onClick={() => handleDelete(tour.id)}>Ištrinti</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <AdminTourForm
          initialTour={editTour}
          onClose={() => setShowForm(false)}
          onSave={fetchTours}
        />
      )}
    </div>
  );
}