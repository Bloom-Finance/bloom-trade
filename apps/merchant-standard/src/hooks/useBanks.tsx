import { useEffect, useState } from 'react';
import { BloomBankAccount, BankAccountForm } from '../type';
import { UserStore } from '../store/user.store';
import { banksServices } from '../services/banks.services';
import { customAlphabet } from 'nanoid';
import { showAlert } from '../components/alert/handler';
import { circleServices } from '../services/circle.services';

export default function useBanks() {
  const [banks, setBanks] = useState<Array<BloomBankAccount>>([]);
  const userId = UserStore.useState((s) => s.id);
  const [loading, setLoading] = useState(true);
  const [circleLoader, setCircleLoader] = useState(false);
  const linkToCircle = async (bank: BloomBankAccount, apiKey: string) => {
    setCircleLoader(true);
    const { data, error } = await banksServices.linkBankToCircle(bank, apiKey);
    if (error && !data) {
      showAlert('Oops! Something went wrong :(', 'error');
      return {
        data: {
          linked: false,
        },
      };
    }
    const modifiedBank = banks.filter((bank) => bank.id === bank.id);
    if (modifiedBank.length > 1 || !data?.id) {
      showAlert('Oops! Something went wrong :(', 'error');
      return {
        data: {
          linked: false,
        },
      };
    }
    modifiedBank[0].circle.isLinked = true;
    modifiedBank[0].circle.id = data.id;
    setBanks([...banks.filter((bank) => bank.id !== bank.id), modifiedBank[0]]);
    setCircleLoader(false);
    return {
      data: {
        linked: true,
      },
    };
  };
  const unLinkToCircle = async (id: string, cb?: () => void) => {
    setCircleLoader(true);
    const { data, error } = await banksServices.unlinkBankFromCircle(id, cb);
    if (error && !data) {
      !cb && setLoading(false);
      return {
        data: {
          unlinked: false,
        },
      };
    }
    const modifiedBank = banks.filter((bank) => bank.id === id);
    if (modifiedBank.length > 1) {
      showAlert('Oops! Something went wrong :(', 'error');
      !cb && setLoading(false);
      return {
        data: {
          unlinked: false,
        },
      };
    }
    modifiedBank[0].circle.isLinked = false;
    modifiedBank[0].circle.id = undefined;
    setBanks([...banks.filter((bank) => bank.id !== id), modifiedBank[0]]);
    setCircleLoader(false);
    return { data };
  };
  const newBank = async (
    formData: BankAccountForm,
    circle?: {
      withCircle?: boolean;
      apiKey?: string;
    }
  ) => {
    setLoading(true);
    const bloomBank: BloomBankAccount = {
      id: customAlphabet('1234567890abcdef', 10)(),
      owner: userId,
      country: formData.countryCode,
      circle: {
        isLinked: false,
      },
      accountNumber: formData.accountNumber,
      routingNumber: formData.routingNumber,
      bankAddress: {
        city: formData.bankAddress.city,
        country: formData.bankAddress.country,
      },
      billingDetails: {
        name: formData.billingDetails.name,
        city: formData.billingDetails.city,
        country: formData.billingDetails.country,
        district: formData.billingDetails.district,
        postalCode: formData.billingDetails.postalCode,
        line1: formData.billingDetails.line1,
      },
      type: formData.accountType,
    };
    if (!circle || !circle.apiKey) {
      //Create a bank without linking it to circle
      await banksServices.createBank(bloomBank);
      setLoading(false);
      return;
    }
    await banksServices.linkBankToCircle(bloomBank, circle.apiKey);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      const retrievedBanks = await banksServices.getBanksByUser(userId);
      setBanks(retrievedBanks);
      setLoading(false);
    })();
  }, []);
  return {
    loading,
    banks,
    newBank,
    linkToCircle,
    unLinkToCircle,
    circleLoader,
  };
}
