import { useBloom } from '@bloom-trade/ui';
import { NextPage } from 'next';
import { usePrepareContractWrite, useContractWrite, useSigner } from 'wagmi';
import { erc20ABI } from 'wagmi';
const swap: NextPage = () => {
  const { Connect } = useBloom();
  const { config, error, isError } = usePrepareContractWrite({
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    abi: erc20ABI,
    chainId: 137,
    functionName: 'approve',
    args: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '1000000' as any],
  });
  const { data, write } = useContractWrite(config);
  return (
    <div>
      <Connect />
      <button disabled={!write} onClick={() => write && write()}>
        Test
      </button>
      {isError && error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default swap;
