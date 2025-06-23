import { useState, useEffect } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import UserBody from "./components/UserBody";
import AdminBody from "./components/AdminBody";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setShowLogin(false);
      setShowRegister(false);
    } else {
      localStorage.removeItem("user");
      setShowLogin(true);
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/users/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch {}
    setUser(null);
  };

  if (!user) {
    return (
      <>
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onLoginSuccess={handleLoginSuccess}
            onRegisterClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <Register
            onClose={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        user={user}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
        onLogout={handleLogout}
      />
      {user?.role === "admin" ? (
        <AdminBody user={user} />
      ) : (
        <UserBody user={user} />
      )}
    </div>
  );
}

export default App;