// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../components/firebase.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Set to true while developing so you don’t have to log in
const DEV_BYPASS = false;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_BYPASS) {
      // Dev bypass: fake logged in user (replace email/name if you want)
      setUser({ uid: "dev-uid", email: "dev@example.com", displayName: "Developer" });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
