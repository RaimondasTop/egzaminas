import React from 'react';
import PropTypes from 'prop-types';

export default function Header({ onLoginClick, onRegisterClick, isLoggedIn, onLogout, onEkskursijosClick, onMyToursClick, userRole }) {
  const handleEkskursijosClick = () => {
    if (userRole === 'admin') {
      onEkskursijosClick('/admin');
    } else {
      onEkskursijosClick('/ekskursijos');
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md flex items-center justify-between px-8 py-4">
      <div className="text-2xl font-bold text-blue-600">Frontas+Backas=Paruostukas</div>
      <nav className="flex gap-4">
        {userRole === 'admin' ? (
          <button className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition" onClick={() => onEkskursijosClick('/admin')}>AdminPanel</button>
        ) : (
          <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition" onClick={handleEkskursijosClick}>Ekskursijos</button>
        )}
        {isLoggedIn && userRole !== 'admin' && (
          <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition" onClick={onMyToursClick}>Mano ekskursijos</button>
        )}
        {isLoggedIn && userRole === 'admin' && (
          <>
            <button className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition" onClick={() => onEkskursijosClick('/admin/datos')}>Tvarkyti datas</button>
            <button className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition" onClick={() => onEkskursijosClick('/admin/registracijos')}>Dalyvių sąrašas</button>
          </>
        )}
        {isLoggedIn ? (
          <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition" onClick={onLogout}>Atsijungti</button>
        ) : (
          <>
            <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition" onClick={onLoginClick}>Prisijungti</button>
            <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition" onClick={onRegisterClick}>Registruotis</button>
          </>
        )}
      </nav>
    </header>
  );
}

Header.propTypes = {
  onLoginClick: PropTypes.func,
  onRegisterClick: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
  onEkskursijosClick: PropTypes.func,
  onMyToursClick: PropTypes.func,
  userRole: PropTypes.string,
};
