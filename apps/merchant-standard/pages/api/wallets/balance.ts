// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Connector from '@bloom-trade/finance-connector';
import {
  ProviderCredentials,
  Chains,
  Providers,
} from '@bloom-trade/finance-connector/dist/@types';
import jwt from 'jsonwebtoken';
import { Chain } from '@bloom-trade/types';
interface IProvidersRequest {
  type: 'circle' | 'binance' | 'coinbase';
  auth: {
    apiKey?: string;
    apiSecret?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const secret = process.env.JWT_SECRET as string;
    const connector = new Connector();
    const { addresses, providers, chains } = req.body;
    const providersRequest = providers as IProvidersRequest[];
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ isValid: false, payload: null });
    const decoded = jwt.verify(token, secret);
    //For now, we are only supporting Circle
    const circleCreds = providersRequest
      ? providersRequest.find((provider) => provider.type === 'circle')
      : null;
    const { testnet, stableCoins } = req.query;
    const mode = process.env.MODE as 'DEV' | 'PROD';
    let providerChains: {
      chain: Chains;
      scannerApiKey: string | undefined;
      scanner: Providers;
    }[] = [];
    if (!chains || chains.length === 0) {
      providerChains = [
        {
          chain: 'avax' as Chains,
          scannerApiKey: process.env.SNOWTRACE_API_KEY,
          scanner: 'snowtrace' as Providers,
        },
        {
          chain: 'eth' as Chains,
          scannerApiKey: process.env.ETHERSCAN_API_KEY,
          scanner: 'etherscan' as Providers,
        },
        {
          chain: 'polygon' as Chains,
          scannerApiKey: process.env.POLYGONSCAN_API_KEY,
          scanner: 'polygonscan' as Providers,
        },
      ];
    } else {
      chains.forEach((chain: Chain) => {
        providerChains.push({
          chain: chain as Chains,
          scannerApiKey:
            chain === 'eth'
              ? process.env.ETHERSCAN_API_KEY
              : chain === 'avax'
              ? process.env.SNOWTRACE_API_KEY
              : process.env.POLYGONSCAN_API_KEY,
          scanner:
            chain === 'eth'
              ? 'etherscan'
              : chain === 'avax'
              ? 'snowtrace'
              : 'polygonscan',
        });
      });
    }
    const providerCreds: ProviderCredentials[] = [];
    if (addresses && addresses.length > 0) {
      providerChains.forEach(({ chain, scanner, scannerApiKey }) => {
        providerCreds.push({
          addresses: addresses,
          chain: chain,
          provider: {
            useTestnet:
              (mode === 'DEV' ? true : false) ||
              (testnet === 'true' ? true : false),
            id: scanner,
            auth: {
              apiKey: scannerApiKey,
            },
          },
        });
      });
    }
    if (circleCreds) {
      providerCreds.push({
        provider: {
          useTestnet:
            (mode === 'DEV' ? true : false) ||
            (testnet === 'true' ? true : false),
          id: 'circle',
          auth: {
            apiKey: circleCreds.auth.apiKey,
          },
        },
      });
    }
    const client = connector.getClient(providerCreds);
    let balance = await client.getBalance();
    if (stableCoins) {
      balance = balance.filter(
        (coin) =>
          coin.asset.includes('usdc') ||
          coin.asset.includes('dai') ||
          coin.asset.includes('usdt')
      );
    }
    return res.status(200).json({
      balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
