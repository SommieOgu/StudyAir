const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;
//----------------------------------------------
app.use(express.json());
//----------------------------------------------
let firebaseInitialized = false;
let initializationError = null;
//----------------------------------------------
try {

  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  firebaseInitialized = true;
  console.log('✅ Firebase SDK Successful.');

} catch (error) {
  initializationError = error.message;
  console.error('Failed to initialize SDK.');
}
//----------------------------------------------
const db = firebaseInitialized ? admin.firestore() : null;
//----------------------------------------------
app.get('/api', (req, res) => {

  const firebaseStatus = firebaseInitialized ? 
    'Connected' : 
    `Connection Failed: ${initializationError || 'Service Key file not found.'}`;
    
  const responseData = {
    message: 'Backend API is running!',
    serverTime: new Date().toISOString(),
    firebaseStatus: firebaseStatus
  };
  res.status(200).json(responseData);
});
//----------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Endpoint accessible at http://localhost:${PORT}/api`);
});

//Used for structure and setup: https://stackoverflow.com/questions/64296423/cant-import-firebase-admin-in-node-js & https://firebase.google.com/docs/admin/setup