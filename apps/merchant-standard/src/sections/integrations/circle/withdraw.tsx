import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { showAlert } from '../../../components/alert/handler';
import BankList from '../../../components/bankList';
import SecuredPage from '../../../components/layout/securedPage';
import useBanks from '../../../hooks/useBanks';
import useCircle from '../../../hooks/useCircle';
import { UserStore } from '../../../store/user.store';

interface Props {}

const CircleWithdrawComponent = (props: Props): JSX.Element => {
  const [amount, setAmount] = useState(0);
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>();
  const { balance, withdraw, pendingWithdrawals, circleLoading } = useCircle();
  const { banks } = useBanks();
  const user = UserStore.useState((s) => s);
  return (
    <>
      <div>
        <Typography variant='h1'>My balance</Typography>
        {balance &&
          balance.available.map((wallet: any) => {
            return (
              <div key={wallet.currency}>
                {wallet.currency} : {wallet.amount}
              </div>
            );
          })}
      </div>
      <input
        type='number'
        placeholder='Amount to withdraw'
        onChange={(e) => {
          setAmount(parseInt(e.target.value));
        }}
      />
      <BankList
        loading={circleLoading}
        data={banks}
        selectable={{
          isSelectable: true,
          onSelect: (bank) => {
            if (bank.circle && bank.circle.id)
              setSelectedBankAccount(bank.circle.id);
            else
              showAlert('Please link your bank account with Circle', 'error');
          },
        }}
      />
      <Button
        variant='contained'
        disabled={selectedBankAccount === undefined || amount <= 0}
        onClick={async () => {
          const { res } = await withdraw(
            selectedBankAccount as string,
            amount,
            'USD',
            user.email as string
          );
          if (!res || !res.success) return;
          showAlert('Withdrawal request sent', 'success');
        }}
      >
        {circleLoading ? 'Loading...' : 'Withdraw'}
      </Button>
      {pendingWithdrawals.length > 0 && (
        <div>
          <p>Pending withdrawals</p>
          {pendingWithdrawals.map((order) => {
            return (
              <>
                <div key={order.id}>
                  <div>{order.id}</div>
                  <div>{order.amount.amount}</div>
                  <div>{order.amount.currency}</div>
                  <div>{order.status}</div>
                </div>
              </>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CircleWithdrawComponent;
