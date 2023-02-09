import {
  Button,
  Grid,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { CryptoWallet, User } from '../../type';
import useResponsive from '../../hooks/useResponsive';
import { cryptoWalletServices } from '../../services/cryptoWallet.services';
import { UserStore } from '../../store/user.store';
interface Props {
  hide: (show: boolean) => void;
  callBack: () => void;
  onSave: (walletData: Partial<CryptoWallet>) => Promise<void>;
}

const Component = (props: Props): JSX.Element => {
  const mdUp = useResponsive('up', 'md');
  const user: User = UserStore.useState((s) => s);
  const [walletData, setWalletData] = React.useState<Partial<CryptoWallet>>({
    address: '',
    brand: 'notDefined',
    chains: ['ETH'],
    currency: 'USDT',
    owner: user.id,
    isPrincipal: false,
  });
  const handleChange = (field: string, data: any) => {
    setWalletData({ ...walletData, [field]: data });
  };

  const save = async () => {
    await props.onSave(walletData);
    props.callBack();
    props.hide(false);
  };
  return (
    <Stack
      direction='row'
      px={mdUp ? 0 : 2}
      alignItems={'center'}
      justifyItems='center'
    >
      <Stack
        spacing={2}
        sx={{
          width: '100%',
        }}
      >
        <TextField
          onChange={(e: any) => handleChange('address', e.target.value)}
          id='outlined-basic'
          label='Wallet Address'
          variant='standard'
        />

        <Select
          id='outlined-basic'
          label='Chain'
          variant='standard'
          value={walletData.chains ? walletData.chains[0] : 'ETH'}
          onChange={(e: any) => handleChange('chain', e.target.value)}
        >
          <MenuItem value='ETH'>Etheruem</MenuItem>
          <MenuItem value='PLG'>Polygon</MenuItem>
        </Select>
        <Select
          id='currency'
          label='Currency'
          variant='standard'
          value={walletData.currency as any}
          onChange={(e: any) => handleChange('currency', e.target.value)}
        >
          <MenuItem value='USDC'>USDC</MenuItem>
          <MenuItem value='USDT'>USDT</MenuItem>
          <MenuItem value='DAI'>DAI</MenuItem>
        </Select>
        <Select
          id='brand'
          label='Wallet Brand'
          variant='standard'
          value={walletData.brand as any}
          onChange={(e: any) => handleChange('brand', e.target.value)}
        >
          <MenuItem value='mm'>MetaMask</MenuItem>

          <MenuItem value='trust'>Trust</MenuItem>
          <MenuItem value='binance'>Binance</MenuItem>
        </Select>

        <Stack direction='row' spacing={2} justifyContent='center' pt={2}>
          <Button onClick={props.hide as any}>Cancel</Button>
          <Button variant='contained' onClick={save}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Component;
