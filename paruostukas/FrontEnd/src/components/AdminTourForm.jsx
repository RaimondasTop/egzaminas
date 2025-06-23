import { useState } from 'react';

export default function AdminTourForm({ onClose, onSave, initialTour }) {
  const [title, setTitle] = useState(initialTour?.title || '');
  const [description, setDescription] = useState(initialTour?.description || '');
  const [price, setPrice] = useState(initialTour?.price || '');
  const [durationMinutes, setDurationMinutes] = useState(initialTour?.duration_minutes || '');
  const [photoUrl, setPhotoUrl] = useState(initialTour?.photo_url || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const method = initialTour ? 'PUT' : 'POST';
      const url = initialTour ? `http://localhost:3000/api/v1/tours/${initialTour.id}` : 'http://localhost:3000/api/v1/tours/';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title, description, price, duration_minutes: durationMinutes, photo_url: photoUrl
        })
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || 'Klaida');
      else {
        if (onSave) onSave();
        onClose();
      }
    } catch {
      setError('Serverio klaida');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md flex flex-col items-center relative border border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-center text-white">{initialTour ? 'Redaguoti ekskursiją' : 'Nauja ekskursija'}</h2>
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <input className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white" placeholder="Pavadinimas" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white" placeholder="Aprašymas" value={description} onChange={e => setDescription(e.target.value)} required />
          <div className="flex items-center gap-4">
            <input className="border border-gray-600 rounded px-3 py-2 flex-1 bg-gray-800 text-white" placeholder="Nuotraukos URL" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
            {photoUrl && (
              <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
                <img src={photoUrl} alt="peržiūra" className="max-h-16 max-w-16 object-contain" />
              </div>
            )}
          </div>
          <input className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white" placeholder="Trukmė (min)" type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} required />
          <input className="border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white" placeholder="Kaina (€)" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition" disabled={submitting}>{initialTour ? 'Išsaugoti' : 'Sukurti'}</button>
            <button type="button" className="text-gray-400 hover:underline" onClick={onClose}>Atšaukti</button>
          </div>
        </form>
      </div>
    </div>
  );
}
