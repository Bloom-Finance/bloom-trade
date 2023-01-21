import { Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { banksServices } from '../../services/banks.services';
import {
  FormContainer,
  TextFieldElement,
  SelectElement,
  useWatch,
} from 'react-hook-form-mui';
import { BankAccountForm } from '../../type';
import useBanks from '../../hooks/useBanks';
import { showAlert } from '../alert/handler';
interface Props {
  circle?: {
    withCircle?: boolean;
    apiKey?: string;
  };
  onCancel?: () => void;
}

const NewBankComponent = (props: Props): JSX.Element => {
  const { newBank, loading } = useBanks();
  const Buttons = () => {
    const values = useWatch({
      name: [
        'bankAddress.city',
        'bankAddress.country',
        'billingDetails.postalCode',
        'billingDetails.name',
        'billingDetails.country',
        'billingDetails.city',
        'billingDetails.line1',
        'billingDetails.district',
        'accountNumber',
        'routingNumber',
      ],
    });
    return (
      <>
        <Button variant='outlined' onClick={props.onCancel}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          disabled={values.includes('')}
        >
          {loading ? 'Loading...' : 'Save'}
        </Button>
      </>
    );
  };
  const [bankAccount, setBankAccount] = useState<BankAccountForm>({
    accountType: 'wire',
    countryCode: 'usa',
    accountNumber: '',
    routingNumber: '',
    bankAddress: {
      city: '',
      country: '',
    },
    billingDetails: {
      name: '',
      country: '',
      city: '',
      line1: '',
      district: '',
      postalCode: '',
    },
  });
  const onSubmit = async (data: BankAccountForm) => {
    await newBank(data, props.circle);
    showAlert('Bank account created successfully', 'success');
  };
  return (
    <>
      <FormContainer defaultValues={bankAccount} onSuccess={onSubmit}>
        <SelectElement
          name='accountType'
          id='accountType'
          label='Account type'
          options={[
            { id: 'wire', label: 'Wire' },
            { id: 'sepa', label: 'Sepa' },
            { id: 'ach', label: 'ACH' },
          ]}
          required
        />
        <SelectElement
          name='countryCode'
          id='countryCode'
          label='Country Code'
          options={[
            { id: 'arg', label: 'ARG' },
            { id: 'usa', label: 'USA' },
          ]}
          required
        />
        <Typography variant='h5'>Bank Data details</Typography>
        <TextFieldElement
          name='accountNumber'
          type='text'
          required
          id='accountNumber'
          label='Account Number'
          placeholder='Enter your account number'
        />
        <TextFieldElement
          name='routingNumber'
          type='text'
          required
          id='routingNumber'
          label='Routing Number'
          placeholder='Enter your routing number'
        />
        <TextFieldElement
          name='bankAddress.country'
          type='text'
          required
          id='bankAddressCountry'
          label='Bank Country'
          placeholder='Enter your Bank  country'
        />
        <TextFieldElement
          name='bankAddress.city'
          type='text'
          required
          id='bankAddressCity'
          label='Bank City'
          placeholder='Enter your Bank  City'
        />
        <Typography variant='h5'>Billing Details</Typography>
        <TextFieldElement
          name='billingDetails.postalCode'
          type='text'
          required
          id='billingDetailsPostalCode'
          label='Postal Code'
          placeholder='Enter your postal code'
        />
        <TextFieldElement
          name='billingDetails.district'
          type='text'
          required
          id='billingDetailsDistrict'
          label='District'
          placeholder='Enter your district'
        />
        <TextFieldElement
          name='billingDetails.line1'
          type='text'
          required
          id='billingDetailsLine1'
          label='Line 1'
          placeholder='Enter your street'
        />
        <TextFieldElement
          name='billingDetails.country'
          type='text'
          required
          id='billingDetailsCountry'
          label='Country'
          placeholder='Enter your country'
        />
        <TextFieldElement
          name='billingDetails.name'
          type='text'
          required
          id='billingDetailsName'
          label='Name'
          placeholder='Enter your name'
        />
        <TextFieldElement
          name='billingDetails.city'
          type='text'
          required
          id='billingDetailsCity'
          label='City'
          placeholder='Enter your city'
        />
        <Buttons />
      </FormContainer>
    </>
  );
};

export default NewBankComponent;
