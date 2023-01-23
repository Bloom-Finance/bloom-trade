import { logInToQuickbooks } from '../../utils/utils';

export const auth = (apiCredentials: {
  client_id: string;
  client_secret: string;
}) => {
  return logInToQuickbooks(
    {
      ...apiCredentials,
    },
    'sandbox',
    'http://localhost:8081/quickbooks/callback'
  );
};
