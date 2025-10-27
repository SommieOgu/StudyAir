import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDO-ZD16xCvMQ4Fy6_LfG2lKPVZgF5oBaM",
  authDomain: "studyair-e4d78.firebaseapp.com",
  projectId: "studyair-e4d78",
  storageBucket: "studyair-e4d78.firebasestorage.app",
  messagingSenderId: "490956478859",
  appId: "1:490956478859:web:f035813318079d9dbd778e",
  measurementId: "G-3PYNPFQMKB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
