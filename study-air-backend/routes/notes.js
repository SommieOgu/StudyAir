// study-air-backend/routes/notes.js
const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

// Try to get Firestore instance
let db;
try {
  db = admin.firestore();
} catch (e) {
  console.warn(
    'Firestore not initialized; notes will not be persisted:',
    e.message
  );
}

/**
 * POST /api/notes
 * Body: { text, filename?, createdAt? }
 */
router.post('/', async (req, res) => {
  try {
    const { text, filename, createdAt } = req.body;

    console.log('POST /api/notes HIT:', { text, filename, createdAt });

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing transcription text' });
    }

    // If Firestore is not available, just echo back success
    if (!db) {
      return res.status(201).json({
        success: true,
        message:
          'Text received (but not saved – Firestore not initialized)',
        textReceived: text,
        filename,
        createdAt,
      });
    }

    const notesCollection = db.collection('notes');

    const docData = {
      text: text.trim(),
      filename: filename || null,
      createdAt: createdAt || new Date().toISOString(),
    };

    const docRef = await notesCollection.add(docData);

    return res.status(201).json({
      success: true,
      message: 'Note saved successfully',
      id: docRef.id,
      ...docData,
    });
  } catch (err) {
    console.error('Error in POST /api/notes:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to save note',
    });
  }
});

/**
 * GET /api/notes
 * Returns last 20 notes
 */
router.get('/', async (req, res) => {
  try {
    if (!db) {
      return res.status(200).json({
        success: true,
        message:
          'Firestore not initialized, so no notes to return. Check backend config.',
        notes: [],
      });
    }

    const snapshot = await db
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (err) {
    console.error('Error in GET /api/notes:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch notes',
    });
  }
});

module.exports = router;
