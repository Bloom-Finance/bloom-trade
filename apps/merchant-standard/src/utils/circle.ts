import { cryptoWalletServices } from '../services/cryptoWallet.services';
import { circleServices } from '../services/circle.services';
import { BloomBankAccount, BloomError } from '../type';
import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { firebaseManager } from '../services/firebase.manager';
import { errorHandler } from '@bloom-trade/utilities';
import { showAlert } from '../components/alert/handler';

async function manageCryptoCircleWallets(userId: string, apiKey: string) {
  //TODO: Check if user had already a wallet linked to circle
  const wallets = await circleServices.getWallets(apiKey);
  const proccesedWallets: Array<{
    address: string;
    chain: Array<string>;
    currency: string;
  }> = [];
  wallets.data.forEach((wallet) => {
    const found = proccesedWallets.find((pw) => pw.address === wallet.address);
    if (!found) {
      proccesedWallets.push({
        address: wallet.address,
        chain: [wallet.chain],
        currency: wallet.currency === 'USD' ? 'USDC' : wallet.currency,
      });
    } else {
      if (!found.chain.includes(wallet.chain)) found.chain.push(wallet.chain);
    }
  });
  const fbCryptoWallets = await cryptoWalletServices.getCircleWalletByUserId(
    userId
  );
  if (fbCryptoWallets.length === 0 || !fbCryptoWallets) {
    for (const wallet of proccesedWallets) {
      const principalWallet = !(await cryptoWalletServices.hasPrincipalWallet(
        userId
      ));
      await cryptoWalletServices.save({
        address: wallet.address,
        chains: wallet.chain,
        brand: 'circle',
        isPrincipal: principalWallet,
        owner: userId,
        currency: wallet.currency === 'USD' ? 'USDC' : wallet.currency,
      });
    }
  } else {
    //We have to update if necessary
    const newWallets: Array<{
      address: string;
      chain: Array<string>;
      currency: string;
    }> = [];
    for (const wallet of proccesedWallets) {
      const found = fbCryptoWallets.find((v) => v.address === wallet.address);
      if (!found) {
        newWallets.push(wallet);
      }
    }
    const principalWallet = !(await cryptoWalletServices.hasPrincipalWallet(
      userId
    ));
    if (newWallets.length > 0) {
      for (const wallet of newWallets) {
        await cryptoWalletServices.save({
          address: wallet.address,
          chains: wallet.chain,
          brand: 'circle',
          isPrincipal: principalWallet,
          owner: userId,
          currency: wallet.currency === 'USD' ? 'USDC' : wallet.currency,
        });
      }
    } else {
      //here we have to update the chain
      for (const wallet of fbCryptoWallets) {
        cryptoWalletServices.updateCryptoWallet(wallet.id as string, {
          ...wallet,
          chains: wallet.chains,
        });
      }
    }
  }
}

async function link(
  bloomBank: BloomBankAccount,
  wireBankId: string
): Promise<{
  data?: { linked: boolean };
  error?: BloomError<FirebaseError>;
}> {
  try {
    const docRef = doc(firebaseManager.getDB(), 'banks', bloomBank.id);
    await updateDoc(docRef, {
      ...bloomBank,
      circle: {
        isLinked: true,
        id: wireBankId,
      },
    });
    return {
      data: {
        linked: true,
      },
    };
  } catch (error) {
    return { error: errorHandler<FirebaseError>(error, showAlert) };
  }
}

export { manageCryptoCircleWallets, link };
