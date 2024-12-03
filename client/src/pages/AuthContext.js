// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to provide the context to its children
export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  // Function to handle login and store email
  const login = (email) => {
    setUserEmail(email);
  };

  return (
    <AuthContext.Provider value={{ userEmail, login }}>
      {children}
    </AuthContext.Provider>
  );
};
