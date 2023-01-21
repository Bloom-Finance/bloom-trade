import {
  collection,
  doc,
  getDocs,
  Query,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
import { CryptoWallet } from '../type';
import { firebaseManager } from './firebase.manager';

interface ICryptoWalletServices {
  getWalletsByUserId(userId: string): Promise<CryptoWallet[]>;
  save(wallet: Partial<CryptoWallet>): Promise<Partial<CryptoWallet>>;
  hasPrincipalWallet(userId: string): Promise<boolean>;
  getCircleWalletByUserId(userId: string): Promise<CryptoWallet[]>;
  updateCryptoWallet(id: string, data: CryptoWallet): Promise<void>;
}

//TODO: Check multiple circle wallets
class CryptoWalletServices implements ICryptoWalletServices {
  async updateCryptoWallet(id: string, data: CryptoWallet): Promise<void> {
    try {
      const docRef = doc(firebaseManager.getDB(), 'cryptoWallets', id);
      await updateDoc(docRef, {
        ...data,
      });
    } catch (error) {
      console.log(error);
      throw new Error('Try catch not implemented');
    }
  }
  async getCircleWalletByUserId(userId: string): Promise<CryptoWallet[]> {
    const fbCryptoWallets = await cryptoWalletServices.getWalletsByUserId(
      userId
    );
    const filteredWallets = fbCryptoWallets.filter((v) => v.brand === 'circle');
    return filteredWallets;
  }
  async hasPrincipalWallet(userId: string): Promise<boolean> {
    const wallets = await this.getWalletsByUserId(userId);
    let hasPrincipalWallet = false;
    wallets.forEach((wallet) => {
      if (wallet.isPrincipal) {
        hasPrincipalWallet = true;
      }
    });
    return hasPrincipalWallet;
  }

  async getWalletsByUserId(userId: string): Promise<CryptoWallet[]> {
    const ref = collection(firebaseManager.getDB(), 'cryptoWallets');
    const q: Query = query(ref, where('owner', '==', userId));
    const querySnapshots = await getDocs(q);
    return querySnapshots.docs.map((doc) => doc.data() as CryptoWallet);
  }

  async save(wallet: Partial<CryptoWallet>): Promise<Partial<CryptoWallet>> {
    let _id = customAlphabet('1234567890abcdef', 10)();

    if (!wallet.id) wallet.id = _id;
    else _id = wallet.id;
    try {
      await setDoc(doc(firebaseManager.getDB(), 'cryptoWallets', _id), wallet);
      return wallet;
    } catch (error) {
      console.log(error);
      throw new Error('Wallet could not be saved');
    }
  }
}

export const cryptoWalletServices = new CryptoWalletServices();
