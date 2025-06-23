import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Ekskursijos from './components/Ekskursijos.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import MyTours from './components/MyTours.jsx';
import AdminDatesPanel from './components/AdminDatesPanel.jsx';
import AdminRegistrationsPanel from './components/AdminRegistrationsPanel.jsx';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return !!savedUser;
  });
  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return user.role || 'user';
      } catch {
        return 'user';
      }
    }
    return 'user';
  });
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserRole(user.role || 'user');
      } catch {
        setUserRole('user');
      }
    } else {
      setUserRole('user');
    }
  }, [isLoggedIn]);
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    console.log('LoginSuccess user:', user);
    setIsLoggedIn(true);
    setShowLogin(false);
    localStorage.setItem('user', JSON.stringify(user));
    if (user?.role === 'admin') {
      setUserRole('admin');
      navigate('/admin');
    } else {
      setUserRole('user');
    }
  };

  const handleRegisterSuccess = (user) => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setUserRole('user');
    if (user) localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/users/logout', {
        method: 'GET',
        credentials: 'include',
      });
    } catch {}
    setIsLoggedIn(false);
    setUserRole('user');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Header 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
        onEkskursijosClick={path => navigate(path)}
        onMyToursClick={() => navigate('/manoturai')}
      />
      {showLogin && <Login onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} onRegisterSuccess={handleRegisterSuccess} />}
      <div className="pt-24">
        <Routes>
          <Route path="/admin" element={userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" replace />} />
          <Route path="/admin/datos" element={userRole === 'admin' ? <AdminDatesPanel /> : <Navigate to="/" replace />} />
          <Route path="/admin/registracijos" element={userRole === 'admin' ? <AdminRegistrationsPanel /> : <Navigate to="/" replace />} />
          <Route path="/ekskursijos" element={<Ekskursijos />} />
          <Route path="/manoturai" element={isLoggedIn ? <MyTours /> : <Navigate to="/" replace />} />
          <Route path="/" element={
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
            </div>
          } />
        </Routes>
      </div>
    </>
  )
}

export default App
