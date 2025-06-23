import { useState } from 'react';
import RegisterModal from './RegisterModal.jsx';

export default function TourCard({ tour, userRole = 'user' }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 w-full max-w-xs mx-auto">
      <h2 className="text-lg font-bold text-blue-700">{tour.title || tour.name}</h2>
      <div className="text-gray-600">{tour.description}</div>
      <div className="flex gap-2 text-sm mt-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Kaina: {tour.price} €</span>
        {tour.duration_minutes && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Trukmė: {tour.duration_minutes} min</span>}
        {tour.duration && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Trukmė: {tour.duration} min</span>}
        {tour.category && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Kategorija: {tour.category}</span>}
        {tour.difficulty && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Sudėtingumas: {tour.difficulty}</span>}
      </div>
      {tour.photo_url && <img src={tour.photo_url} alt={tour.title} className="w-full h-32 object-cover rounded mt-2" />}
      {userRole === 'user' ? (
        <button className="mt-4 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={() => setShowModal(true)}>
          Rezervuoti laiką
        </button>
      ) : (
        <button className="mt-4 bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed" disabled>
          Rezervuoti laiką galima tik prisijungus
        </button>
      )}
      {showModal && <RegisterModal tourId={tour.id} onClose={() => setShowModal(false)} />}
    </div>
  );
}
