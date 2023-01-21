import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  ref,
  getStorage,
  uploadBytes,
  UploadResult,
  deleteObject,
  getMetadata,
  FullMetadata,
  getDownloadURL,
} from 'firebase/storage';
import { getDatabase } from 'firebase/database';

class FirebaseManager {
  private firebaseApp: FirebaseApp | undefined;
  constructor() {
    if (process.env.FIREBASE) {
      this.firebaseApp = initializeApp(
        JSON.parse(
          Buffer.from(process.env.FIREBASE as string, 'base64').toString()
        )
      );
    } else {
      console.log('There is no firebase config');
    }
  }
  getDB() {
    return getFirestore();
  }
  getFirebaseApp() {
    return this.firebaseApp;
  }
}

export const firebaseManager = new FirebaseManager();
