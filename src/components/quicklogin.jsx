import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const QuickLogin = () => {
  const auth = getAuth();

  const handleQuickLogin = () => {
    signInWithEmailAndPassword(auth, "test@example.com", "testpassword")
      .then(() => alert("Logged in as test@example.com"))
      .catch(err => alert("Login failed: " + err.message));
  };

  return <button onClick={handleQuickLogin}>Quick Login as Test User</button>;
};

export default QuickLogin;
