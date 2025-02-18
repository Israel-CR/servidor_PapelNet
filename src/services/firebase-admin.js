const admin = require('firebase-admin');
const { getStorage, getDownloadURL } = require('firebase-admin/storage');


// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  storageBucket: 'stream-d69b2.appspot.com' // Reemplaza con tu bucket
});

const bucket = getStorage().bucket();

class FirebaseStorageService {
  
  async uploadImage(file) {
    return new Promise(async (resolve, reject) => {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', async () => {
        try {
          const downloadURL = await getDownloadURL(blob);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      });

      blobStream.end(file.buffer);
    });
  }
}

module.exports = new FirebaseStorageService();
