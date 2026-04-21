import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check url constraints for oauth redirect token
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming token has standard jwt payload or permissions injected
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
           setUser({
              id: decoded.sub || decoded.id,
              // we may want to fetch user details from /api/users/me later, or rely on JWT claims directly
              // for simplicity, if backend only provides standard claims, role validation might need a custom claim or user fetch.
              // Let's assume backend didn't embed roles in JWT (as we used simple Subject). 
              // We'll mock role from fetch or rely on decoding later. Let's just set decoded.
              ...decoded
           });
        } else {
           localStorage.removeItem('token');
        }
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ id: decoded.sub, ...decoded });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
