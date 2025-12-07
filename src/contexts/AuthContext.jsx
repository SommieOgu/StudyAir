import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uname = username.trim();
    const usernameKey = uname.toLowerCase();

    // Ensure unique username and save user profile in a single transaction
    await runTransaction(db, async (tx) => {
      const usernameRef = doc(db, "usernames", usernameKey);
      const usernameSnap = await tx.get(usernameRef);
      if (usernameSnap.exists()) {
        throw new Error("Username is already taken");
      }

      const userRef = doc(db, "users", user.uid);
      tx.set(usernameRef, { uid: user.uid, username: uname, createdAt: serverTimestamp() });
      tx.set(
        userRef,
        { username: uname, usernameLowercase: usernameKey, email: user.email, createdAt: serverTimestamp() },
        { merge: true }
      );
    });

    // Also set Firebase Auth displayName for convenience
    await updateProfile(user, { displayName: uname });

    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
