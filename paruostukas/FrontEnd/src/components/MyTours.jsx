import { useEffect, useState } from 'react';
import ChangeDateModal from './ChangeDateModal.jsx';

export default function MyTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(null); // registrationId

  const fetchTours = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/users/me/tours', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Nepavyko gauti ekskursijų');
        setTours([]);
      } else {
        setTours(data.data || []);
      }
    } catch {
      setError('Serverio klaida');
      setTours([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  const handleCancel = async (registrationId) => {
    if (!window.confirm('Ar tikrai norite atšaukti dalyvavimą?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/tours/registration/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) fetchTours();
      else alert('Nepavyko atšaukti');
    } catch {
      alert('Serverio klaida');
    }
  };

  return (
    <div className="pt-24 px-4">
      <h1 className="text-2xl font-bold mb-4">Mano ekskursijos</h1>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.length === 0 && !loading && <div className="col-span-full text-gray-500">Nėra užsiregistruotų ekskursijų.</div>}
        {tours.map((tour, idx) => (
          <div key={tour.registration_id || idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 w-full max-w-xs mx-auto">
            <h2 className="text-lg font-bold text-blue-700">{tour.title || tour.name}</h2>
            <div className="text-gray-600">{tour.description}</div>
            <div className="flex gap-2 text-sm mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Kaina: {tour.price} €</span>
              {tour.tour_date && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Data: {tour.tour_date.slice(0, 10)}</span>}
              {tour.is_confirmed && <span className="bg-green-200 text-green-800 px-2 py-1 rounded">Patvirtinta</span>}
            </div>
            {tour.photo_url && <img src={tour.photo_url} alt={tour.title} className="w-full h-32 object-cover rounded mt-2" />}
            {tour.comment && <div className="mt-2 text-sm text-gray-700">Komentaras: {tour.comment}</div>}
            {tour.rating && <div className="mt-1 text-sm text-yellow-600">Įvertinimas: {tour.rating}/5</div>}
            <div className="flex gap-2 mt-2">
              <button className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition" onClick={() => handleCancel(tour.registration_id)}>Atšaukti</button>
              <button className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition" onClick={() => setShowChangeModal(tour.registration_id)}>Keisti datą</button>
            </div>
            {showChangeModal === tour.registration_id && (
              <ChangeDateModal
                registrationId={tour.registration_id}
                currentTourId={tour.id}
                currentDateId={tour.tour_date_id}
                onClose={() => setShowChangeModal(null)}
                onSuccess={() => { setShowChangeModal(null); fetchTours(); }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
