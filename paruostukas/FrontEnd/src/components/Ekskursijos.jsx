import { useEffect, useState } from 'react';
import TourCard from './TourCard.jsx';

export default function Ekskursijos() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Naudojame tik reikalingas reikšmes iš localStorage
  const userRole = (() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.role || 'user';
      } catch {
        return 'user';
      }
    }
    return 'guest';
  })();
  const isLoggedIn = !!localStorage.getItem('user');

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/v1/tours');
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Nepavyko gauti turų');
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
    fetchTours();
  }, []);

  return (
    <div className="pt-0 px-4 mt-0">
      <div className="flex items-center mb-4 -mt-8">
        <h1 className="text-2xl font-bold mr-4">Ekskursijos</h1>
      </div>
      {loading && <div>Kraunama...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour, idx) => (
          <TourCard key={tour.id || idx} tour={tour} userRole={isLoggedIn ? userRole : 'guest'} />
        ))}
      </div>
    </div>
  );
}
