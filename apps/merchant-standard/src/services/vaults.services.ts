import { Vault } from '@bloom-trade/types';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  Query,
  where,
} from 'firebase/firestore';
import { firebaseManager } from './firebase.manager';

interface IVaultsServices {
  getVaultsByUserId(userId: string): Promise<Vault[]>;
}

class VaultsServices implements IVaultsServices {
  async getVaultsByUserId(userId: string): Promise<Vault[]> {
    const ref = collection(firebaseManager.getDB(), 'vaults');
    const q: Query = query(ref, where('user', '==', userId));
    const querySnapshots = await getDocs(q);
    return querySnapshots.docs.map((doc) => doc.data() as Vault);
  }
}

export const vaultsServices = new VaultsServices();
