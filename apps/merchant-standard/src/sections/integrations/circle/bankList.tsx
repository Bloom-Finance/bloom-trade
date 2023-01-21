import { showAlert } from '../../../components/alert/handler';
import BankList from '../../../components/bankList';
import withPreCheckCircle from '../../../controls/hoc/Circle';
import useBanks from '../../../hooks/useBanks';
import { UserStore } from '../../../store/user.store';
import { BloomBankAccount } from '../../../type';

interface Props {}

const CircleBankList = (props: Props): JSX.Element => {
  const { banks, loading, linkToCircle, unLinkToCircle, circleLoader } =
    useBanks();
  const apiKey = UserStore.useState((s) => s.circleApiKey);
  const linkBankToCircle = async (bank: BloomBankAccount) => {
    const { data } = await linkToCircle(bank, apiKey as string);
    if (!data.linked) return;
    showAlert('Bank linked to circle', 'success');
    return;
  };
  const unlinkFromCircle = async (bank: BloomBankAccount) => {
    const { data } = await unLinkToCircle(bank.id);
    if (!data || !data.unlinked) return;
    showAlert('Bank unlinked from circle', 'success');
  };
  return (
    <>
      <BankList
        data={banks}
        loading={loading}
        circle={{
          withCircle: true,
          apiKey,
          linkEvent: linkBankToCircle,
          unlinkEvent: unlinkFromCircle,
          loader: circleLoader,
        }}
      />
    </>
  );
};

export default withPreCheckCircle(CircleBankList, {
  redirectUrl: '/dashboard',
  shouldRedirect: true,
});
