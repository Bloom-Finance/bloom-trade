import { Button, Stack, Typography } from '@mui/material';
import { BloomBankAccount } from '../../type';
import Loader from '../loader';
import NoItemsCard from '../noItemsCard';
import CardSurfaces from '../surfaces/Card';
import _ from 'lodash';
import { useState } from 'react';
import NewBankComponent from '../newBank';

interface Props {
  loading: boolean;
  data: Array<BloomBankAccount>;
  circle?: {
    withCircle?: boolean;
    apiKey?: string;
    linkEvent: (bank: BloomBankAccount) => void;
    unlinkEvent: (bank: BloomBankAccount) => void;
    loader: boolean;
  };
  selectable?: {
    onSelect: (bank: BloomBankAccount) => void;
    isSelectable: boolean;
  };
}

const BankList = (props: Props): JSX.Element => {
  const [wantToAddBank, setWantToAddBank] = useState(false);
  if (props.loading) return <Loader></Loader>;
  return (
    <Stack>
      <>
        <Stack
          pb={4}
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Typography variant='h4'>My bank accounts</Typography>
          {!_.isEmpty(props.data) &&
            !wantToAddBank &&
            !props.loading &&
            (!props.selectable || !props.selectable?.isSelectable) && (
              <Button
                onClick={() => {
                  setWantToAddBank(true);
                }}
                variant='outlined'
                size='small'
              >
                Add new bank account
              </Button>
            )}
        </Stack>
        {props.data.length === 0 &&
        (!props.selectable || !props.selectable?.isSelectable) ? (
          <>
            {!wantToAddBank ? (
              <Stack>
                <NoItemsCard
                  actionSection={
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => {
                        setWantToAddBank(true);
                      }}
                    >
                      Add bank account
                    </Button>
                  }
                  title='No Bank Accounts'
                  description="You don't have a bank account configured yet, please, create the first one"
                />
              </Stack>
            ) : (
              <NewBankComponent
                onCancel={() => {
                  setWantToAddBank(false);
                }}
                circle={props.circle}
              />
            )}
          </>
        ) : (
          <>
            {wantToAddBank ? (
              <NewBankComponent
                onCancel={() => {
                  setWantToAddBank(false);
                }}
                circle={props.circle}
              />
            ) : (
              <CardSurfaces>
                {props.data.map((bank) => {
                  return (
                    <div key={bank.id}>
                      <Typography variant='body1'>{bank.id}</Typography>
                      <Typography variant='body1'>{bank.type}</Typography>
                      <Typography variant='body1'>{bank.country}</Typography>
                      <Typography variant='body1'>
                        {bank.accountNumber}
                      </Typography>
                      {props.selectable && props.selectable?.isSelectable && (
                        <Button
                          variant='contained'
                          onClick={() => {
                            props.selectable?.onSelect(bank);
                          }}
                        >
                          Select
                        </Button>
                      )}
                      {props.circle && (
                        <>
                          {bank.circle.isLinked ? (
                            <Button
                              variant='contained'
                              onClick={async () => {
                                props.circle?.unlinkEvent(bank);
                              }}
                            >
                              {props.circle.loader
                                ? 'Loading...'
                                : 'Unlink from circle'}
                            </Button>
                          ) : (
                            <Button
                              variant='contained'
                              onClick={async () => {
                                await props.circle?.linkEvent(bank);
                              }}
                            >
                              {props.circle.loader
                                ? 'Loading...'
                                : 'Link to circle'}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </CardSurfaces>
            )}
          </>
        )}
      </>
    </Stack>
  );
};

export default BankList;
