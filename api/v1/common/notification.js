// src/lib/firebase.js
const admin = require('firebase-admin');

let app;
if (!admin.apps.length) {
  // Prefer loading JSON from an env var for container safety
  // export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} else {
  app = admin.app();
}

module.exports = {
  admin,
  messaging: admin.messaging(),
};
