import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BloomBankAccount,
  BloomError,
  CircleWireBankAccount,
  BankAccountForm,
} from '../type';
import { firebaseManager } from './firebase.manager';
import { errorHandler } from '@bloom-trade/utilities';
import { FirebaseError } from 'firebase/app';
import { circleServices } from './circle.services';
import { link } from '../utils/circle';
import { showAlert } from '../components/alert/handler';

interface IBanksServices {
  getBanksByUser(userId: string): Promise<Array<BloomBankAccount>>;
  createBank(
    data: BloomBankAccount
  ): Promise<{ data?: BloomBankAccount; error?: BloomError<FirebaseError> }>;
  linkBankToCircle(
    bloomBank: BloomBankAccount,
    circleApiKey: string
  ): Promise<{
    data?: CircleWireBankAccount;
    error?: BloomError<FirebaseError>;
  }>;
  unlinkBankFromCircle(
    bloomBankId: string,
    cb?: () => void
  ): Promise<{
    data?: { unlinked: boolean };
    error?: BloomError<FirebaseError>;
  }>;
}
class BanksServices implements IBanksServices {
  /**
   * It creates a bank account in Bloom (if is not already created) and then links it to a Circle account
   * @param {BloomBankAccount} bloomBank - BloomBankAccount
   * @param {string} circleApiKey - The api key for the circle account
   * @returns {
   *     data?: CircleWireBankAccount | undefined;
   *     error?: BloomError<FirebaseError> | undefined;
   *   }
   */
  async linkBankToCircle(
    bloomBank: BloomBankAccount,
    circleApiKey: string
  ): Promise<{
    data?: CircleWireBankAccount | undefined;
    error?: BloomError<FirebaseError> | undefined;
  }> {
    try {
      const docRef = doc(firebaseManager.getDB(), 'banks', bloomBank.id);
      const docSnap = await getDoc(docRef);
      let bank = docSnap.data() as BloomBankAccount;
      if (!bank) {
        //Create a bank and then link it to circle
        const { data } = (await this.createBank(bloomBank)) as {
          data: BloomBankAccount;
        };
        bank = data;
      }
      switch (bloomBank.type) {
        case 'wire':
          const { data: resWire, error } =
            await circleServices.createWireBankAccount(circleApiKey, bloomBank);
          await link(bank, (resWire as CircleWireBankAccount).id);
          return { data: resWire };
        default:
          return { error: errorHandler('Invalid bank type', showAlert) };
      }
    } catch (error) {
      return { error: errorHandler<FirebaseError>(error, showAlert) };
    }
  }
  async unlinkBankFromCircle(
    bloomBankId: string,
    cb?: () => void
  ): Promise<{
    data?: { unlinked: boolean } | undefined;
    error?: BloomError<FirebaseError> | undefined;
  }> {
    try {
      const docRef = doc(firebaseManager.getDB(), 'banks', bloomBankId);
      const docSnap = await getDoc(docRef);
      const bank = docSnap.data() as BloomBankAccount;
      if (!bank)
        return {
          data: { unlinked: false },
          error: errorHandler('No bank with such id', showAlert),
        };
      await updateDoc(docRef, {
        ...bank,
        circle: {
          isLinked: false,
          id: '',
        },
      });
      return {
        data: { unlinked: true },
      };
    } catch (error) {
      return {
        error: errorHandler<FirebaseError>(error, showAlert, cb),
      };
    }
  }
  async createBank(
    data: BloomBankAccount
  ): Promise<{ data?: BloomBankAccount; error?: BloomError<FirebaseError> }> {
    try {
      await setDoc(doc(firebaseManager.getDB(), 'banks', data.id), data);
      return {
        data,
      };
    } catch (error) {
      return { error: errorHandler<FirebaseError>(error, showAlert) };
    }
  }
  async getBanksByUser(userId: string): Promise<BloomBankAccount[]> {
    const ref = collection(firebaseManager.getDB(), 'banks');
    const q: Query = query(ref, where('owner', '==', userId));
    const querySnapshots = await getDocs(q);
    const banks: BloomBankAccount[] = [];
    for (const doc of querySnapshots.docs) {
      const data = doc.data() as BloomBankAccount;
      banks.push(data);
    }
    return banks;
  }
}

export const banksServices = new BanksServices();
