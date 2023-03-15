import {
  collection,
  doc,
  getDoc,
  getDocs,
  Query,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { customAlphabet } from 'nanoid';
import { WalletsUsers } from '../type';
import { User } from '@bloom-trade/types';
import { isWeb3WalletByAddress } from '../utils/wallets';
import { firebaseManager } from './firebase.manager';

interface IUsersServices {
  searchUserByWallet(wallet: string): Promise<{
    found: boolean;
    user:
      | {
          address: string;
          userData: User;
        }
      | undefined;
  }>;
  getUserById(id: string): Promise<User>;
  createUser(extraData: Partial<User>, wallet: string): Promise<User>;
  attachUserToWallet(wallet: string, userId: string): Promise<WalletsUsers>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  searchWeb3WalletByUser(userId: string): Promise<{
    found: boolean;
    wallet: string;
  }>;
  saveTransakApiKey(userId: string, apiKey: string): Promise<void>;
}

class UsersServices implements IUsersServices {
  async saveTransakApiKey(userId: string, apiKey: string): Promise<void> {
    try {
      await updateDoc(doc(firebaseManager.getDB(), 'users', userId), {
        transakApiKey: apiKey,
      });
    } catch (error) {
      throw new Error('User could not be updated');
    }
  }
  async searchWeb3WalletByUser(
    userId: string
  ): Promise<{ found: boolean; wallet: string }> {
    const ref = collection(firebaseManager.getDB(), 'walletsByUser');
    const q: Query = query(ref, where('userId', '==', userId));
    const querySnapshots = await getDocs(q);
    const wallets: Array<{
      userId: string;
      walletAddress: string;
    }> = [];
    for (const doc of querySnapshots.docs) {
      const data = doc.data() as WalletsUsers;
      wallets.push({
        userId: data.userId,
        walletAddress: data.walletAddress,
      });
    }
    if (wallets.length === 0) throw new Error('No wallet found');
    let wallet;
    wallets.forEach((element) => {
      if (isWeb3WalletByAddress(element.walletAddress))
        wallet = {
          found: true,
          wallet: element.walletAddress,
        };
    });
    if (wallet) return wallet;
    return {
      found: false,
      wallet: '',
    };
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      await updateDoc(doc(firebaseManager.getDB(), 'users', id), data);
      return {
        id,
        ...data,
      } as User;
    } catch (error) {
      console.log(error);
      throw new Error('User could not be updated');
    }
  }
  async attachUserToWallet(
    wallet: string,
    userId: string
  ): Promise<WalletsUsers> {
    const walletByUser = {
      walletAddress: wallet,
      userId: userId,
    };
    try {
      await setDoc(
        doc(
          firebaseManager.getDB(),
          'walletsByUser',
          customAlphabet('1234567890abcdef', 10)()
        ),
        walletByUser
      );
      return walletByUser;
    } catch (error) {
      throw new Error('Wallet could not be attached to user');
    }
  }
  async createUser(extraData: Partial<User>, wallet: string): Promise<User> {
    const user: User = {
      id: customAlphabet('1234567890abcdef', 10)(),
      iat: Date.now(),
      ...extraData,
    };

    try {
      await setDoc(doc(firebaseManager.getDB(), 'users', user.id), user);
      await this.attachUserToWallet(wallet, user.id);
      return user;
    } catch (error) {
      throw new Error('User not created');
    }
  }
  async getUserById(id: string): Promise<User> {
    try {
      const docRef = doc(firebaseManager.getDB(), 'users', id);
      const docSnap = await getDoc(docRef);
      return docSnap.data() as User;
    } catch (error) {
      throw new Error('User not found');
    }
  }
  async searchUserByWallet(wallet: string): Promise<{
    found: boolean;
    user:
      | {
          address: string;
          userData: User;
        }
      | undefined;
  }> {
    const ref = collection(firebaseManager.getDB(), 'walletsByUser');
    const q: Query = query(ref, where('walletAddress', '==', wallet));
    const querySnapshots = await getDocs(q);
    const users: Array<{
      address: string;
      userData: User;
    }> = [];

    for (const doc of querySnapshots.docs) {
      const data = doc.data() as WalletsUsers;
      const user = await this.getUserById(data.userId);
      users.push({
        address: data.walletAddress,
        userData: user,
      });
    }
    if (users.length > 1) throw new Error('More than one user found');
    if (users.length === 0) return { found: false, user: undefined };
    return { found: true, user: users[0] };
  }
}

export const userServices = new UsersServices();
