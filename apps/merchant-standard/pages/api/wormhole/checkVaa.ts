// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  coalesceChainName,
  CONTRACTS,
  getEmitterAddressEth,
  parseSequenceFromLogEth,
} from '@certusone/wormhole-sdk';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { seq } = req.body;
  const emmiterAddr = getEmitterAddressEth(
    CONTRACTS['TESTNET'][coalesceChainName(2)].token_bridge || '' // Wormhole token bridge contract address
  );
  const vaaURL = `${process.env.WORMHOLE_VAA}/${emmiterAddr}/${seq}`;
  let vaaBytes = await (await fetch(vaaURL)).json();
  if (!vaaBytes.vaaBytes) {
    res.status(404).json({ error: 'VAA not found' });
  } else {
    res.status(200).json({
      bytes: vaaBytes.vaaBytes,
    });
  }
}
