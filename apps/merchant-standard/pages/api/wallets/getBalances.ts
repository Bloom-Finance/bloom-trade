// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import Connector from '@bloom-trade/positions-connector';
import {
  ProviderCredentials,
  Chains,
  Providers,
} from '@bloom-trade/positions-connector/dist/@types';

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
    const connector = new Connector();
    const { addresses, providers } = req.body;
    const providersRequest = providers as IProvidersRequest[];
    //For now, we are only supporting Circle
    const circleCreds = providersRequest
      ? providersRequest.find((provider) => provider.type === 'circle')
      : null;

    const { testnet } = req.query;
    const mode = process.env.MODE as 'DEV' | 'PROD';
    const chains = [
      {
        chain: 'avax' as Chains,
        scannerApiKey: process.env.SNOWTRACE_API_KEY,
        scanner: 'snowtrace' as Providers,
      },
      {
        chain: 'polygon' as Chains,
        scannerApiKey: process.env.POLYGONSCAN_API_KEY,
        scanner: 'polygonscan' as Providers,
      },
      {
        chain: 'eth' as Chains,
        scannerApiKey: process.env.ETHERSCAN_API_KEY,
        scanner: 'etherscan' as Providers,
      },
    ];
    const providerCreds: ProviderCredentials[] = [];
    if (addresses && addresses.length > 0) {
      chains.forEach(({ chain, scanner, scannerApiKey }) => {
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
    const balance = await client.getBalance();
    return res.status(200).json({
      balance,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
