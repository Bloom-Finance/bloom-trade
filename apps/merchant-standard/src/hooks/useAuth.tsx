import { User } from '@bloom-trade/types';
import { authService } from '../services/auth.services';

export default function useAuth() {
  function getUserLoggedIn() {
    const _user: User = {
      id: 'undefined',
      displayName: 'undefined by Alex',
      email: 'undefined',
      iat: 0,
    };
    return _user;
  }

  return {
    getUserLoggedIn,
  };
}
