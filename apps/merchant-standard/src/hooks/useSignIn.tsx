import { Web3Auth } from '@web3auth/modal';
import { customAlphabet } from 'nanoid';
import { useState, useEffect } from 'react';
import { Web3AuthSessionPayloadSocialMedia, User } from '../type';
import { authService } from '../services/auth.services';
import { userServices } from '../services/users.services';
import { manageWeb3AuthWallets } from '../utils/wallets';

const useSignIn = (
  web3Auth: Web3Auth
): {
  signIn?: () => Promise<{
    user: User;
    wasUserRegistered: boolean;
  }>;
  loading: boolean;
  waitingForSignIn: boolean;
  error?: any;
} => {
  const [loading, setLoading] = useState(false);
  const [waitingForSignIn, setWaitingForSignIn] = useState(false);
  const signIn = async (): Promise<{
    user: User;
    wasUserRegistered: boolean;
  }> => {
    setWaitingForSignIn(true);
    const token = await (await web3Auth.authenticateUser()).idToken;
    setWaitingForSignIn(false);
    setLoading(true);
    const type =
      web3Auth.connectedAdapterName === 'openlogin' ? 'social' : 'web3';
    const data = await authService.verifyWeb3AuthToken(token, type);
    const payload = data.payload;
    if (!data.isValid) {
      //Launch Web3Auth Modal logout
      setLoading(false);
      alert('Invalid Token');
    }
    const proccesedWallets = manageWeb3AuthWallets(payload)[0]; //For the moment I'm only using the first wallet
    try {
      const { found, user } = await userServices.searchUserByWallet(
        proccesedWallets.address
      );
      if (!user) {
        //Create user
        const newUser: User = {
          iat: Date.now(),
          id: customAlphabet('1234567890abcdef', 10)(),
        };
        if (proccesedWallets.type === 'social') {
          Object.assign(newUser, {
            email: (payload as Web3AuthSessionPayloadSocialMedia).email,
            name: (payload as Web3AuthSessionPayloadSocialMedia).name,
          });
        }
        const createdUser = await userServices.createUser(
          newUser,
          proccesedWallets.address
        );
        await authService.createToken({
          userId: createdUser.id,
          iat: createdUser.iat,
        });
        setLoading(false);
        return {
          user: createdUser,
          wasUserRegistered: false,
        };
      } else {
        await authService.createToken({
          userId: user.userData.id,
          iat: user.userData.iat,
        });
        setLoading(false);
        return {
          user: user.userData,
          wasUserRegistered: true,
        };
      }
    } catch (error) {
      throw new Error('Error checking user existance');
    }
  };
  return {
    signIn,
    loading,
    waitingForSignIn,
  };
};

export default useSignIn;
