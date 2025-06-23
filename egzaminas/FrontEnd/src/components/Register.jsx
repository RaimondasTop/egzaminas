import { useState } from 'react';

export default function Register({ onClose, onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordconfirm) {
      setError('Slaptažodžiai nesutampa');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, passwordconfirm })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registracijos klaida');
        return;
      }
      if (data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      if (onRegisterSuccess) onRegisterSuccess(data.data.user);
    } catch (err) {
      setError('Serverio klaida: ' + (err?.message || ''));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-center">Registruotis</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Vartotojo vardas"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-300"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="El. paštas"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Slaptažodis"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Pakartokite slaptažodį"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-green-300"
            value={passwordconfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Registruotis</button>
          <button type="button" onClick={onClose} className="text-gray-500 hover:underline text-sm mt-2">Uždaryti</button>
        </form>
      </div>
    </div>
  );
}
