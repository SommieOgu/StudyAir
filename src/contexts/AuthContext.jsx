import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, runTransaction, serverTimestamp, getDoc, deleteDoc } from "firebase/firestore";
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

    await updateProfile(user, { displayName: uname });

    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(user, newUsername) {
    const uname = newUsername.trim();
    const usernameKey = uname.toLowerCase();
    const oldUsernameKey = (user.displayName || "").toLowerCase(); 

    if (usernameKey === oldUsernameKey) {
        if (user.displayName === null) {
            await updateProfile(user, { displayName: uname });
            return;
        }
        return; 
    }
    
    await runTransaction(db, async (tx) => {
      const usernameRef = doc(db, "usernames", usernameKey);
      const usernameSnap = await tx.get(usernameRef);
      if (usernameSnap.exists() && usernameSnap.data().uid !== user.uid) {
        throw new Error("Username is already taken by another user");
      }

      if (oldUsernameKey) {
        const oldUsernameRef = doc(db, "usernames", oldUsernameKey);
        tx.delete(oldUsernameRef);
      }
      
      const userRef = doc(db, "users", user.uid);
      tx.set(usernameRef, { uid: user.uid, username: uname, createdAt: serverTimestamp() });
      tx.update(userRef, { username: uname, usernameLowercase: usernameKey });
    });

    await updateProfile(user, { displayName: uname });
  }

  function updateUserPassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword);
  }

  function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
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
    logout,
    updateUserProfile, 
    updateUserPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
