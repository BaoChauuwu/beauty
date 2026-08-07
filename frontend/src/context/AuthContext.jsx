import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dermacare_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check logged in user state on mount
    const savedUser = localStorage.getItem('dermacare_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('dermacare_user');
      }
    }
    setLoading(false);
  }, [token]);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('dermacare_user', JSON.stringify(userData));
    localStorage.setItem('dermacare_token', authToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dermacare_user');
    localStorage.removeItem('dermacare_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        isAdmin: user?.role === 'admin' || user?.role === 'doctor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
