import admin from 'firebase-admin';
import serviceAccount from '../config/api-rastro-urbano.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as object),
  storageBucket: 'gs://rastro-urbano.appspot.com', // Substitua pelo nome do seu bucket de armazenamento
});

const bucket = admin.storage().bucket();

export default bucket;
