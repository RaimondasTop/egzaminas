import { useState } from 'react';

export default function Login({ onClose, onLoginSuccess, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Prisijungimo klaida');
        return;
      }
      const user = data?.data?.user;
      if (!user) {
        setError('Neteisingas serverio atsakymas');
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setError('Serverio klaida: ' + (err?.message || '')); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-center">Prisijungti</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="El. paštas"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400:b color bg-green-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Slaptažodis"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400:b color bg-green-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Prisijungti</button>
          <button type="button" onClick={onClose} className="text-gray-500 hover:underline text-sm mt-2">Uždaryti</button>
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            Neturite paskyros? Registruotis
          </button>
        </form>
      </div>
    </div>
  );
}