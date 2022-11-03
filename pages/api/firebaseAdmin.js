const admin = require('firebase-admin');

// use environment variables to initialize the app! 🎉
const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // replace `\` and `n` character pairs w/ single `\n` character
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

const adminApp = !admin.apps.length
  ? admin.initializeApp(firebaseAdminConfig)
  : admin;

export { adminApp };
