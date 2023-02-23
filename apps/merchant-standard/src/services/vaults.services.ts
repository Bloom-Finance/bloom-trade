import { Vault } from '@bloom-trade/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Query,
  where,
} from 'firebase/firestore';
import { firebaseManager } from './firebase.manager';

interface IVaultsServices {
  getVaultsByUserId(userId: string): Promise<Vault[]>;
  getVault(id: string): Promise<Vault>;
}

class VaultsServices implements IVaultsServices {
  async getVault(id: string): Promise<Vault> {
    try {
      const docRef = doc(firebaseManager.getDB(), 'vaults', id);
      const docSnap = await getDoc(docRef);
      return docSnap.data() as Vault;
    } catch (error) {
      throw new Error('User not found');
    }
  }
  async getVaultsByUserId(userId: string): Promise<Vault[]> {
    const ref = collection(firebaseManager.getDB(), 'vaults');
    const q: Query = query(ref, where('user', '==', userId));
    const querySnapshots = await getDocs(q);
    return querySnapshots.docs.map((doc) => doc.data() as Vault);
  }
}

export const vaultsServices = new VaultsServices();
