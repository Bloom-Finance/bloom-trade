import { Store } from 'pullstate';

interface IUserStore {
  displayName?: string;
  email?: string;
  id: string;
  iat: number;
  circleApiKey?: string;
  transakApiKey?: string;
}

export const UserStore = new Store<IUserStore>({
  id: '',
  displayName: undefined,
  email: undefined,
  iat: 0,
  circleApiKey: undefined,
  transakApiKey: undefined,
});
