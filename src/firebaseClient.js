import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO-ZD16xCvMQ4Fy6_LfG2lKPVZgF5oBaM",
  authDomain: "studyair-e4d78.firebaseapp.com",
  projectId: "studyair-e4d78",
  storageBucket: "studyair-e4d78.firebasestorage.app",
  messagingSenderId: "490956478859",
  appId: "1:490956478859:web:f035813318079d9dbd778e",
  measurementId: "G-3PYNPFQMKB",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("🔥 Firebase initialized (React)");
} else {
  console.log("🔥 Firebase app already initialized (React)");
}

export const firestore = firebase.firestore();