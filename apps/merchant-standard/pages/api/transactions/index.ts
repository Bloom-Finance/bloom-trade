// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next';
import Connector from '@bloom-trade/finance-connector';
import { Chain, Provider } from '@bloom-trade/types';
import { ProviderCredentials } from '@bloom-trade/finance-connector/dist/@types';
import jwt from 'jsonwebtoken';
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
    /* It's getting the idToken from the request. */
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ isValid: false, payload: null });
    const decoded = jwt.verify(token, secret);
    const connector = new Connector();
    const { addresses, providers, filterParams } = req.body;
    const providersRequest = providers as IProvidersRequest[];
    //For now, we are only supporting Circle
    const circleCreds = providersRequest
      ? providersRequest.find((provider) => provider.type === 'circle')
      : null;

    const { testnet } = req.query;
    const mode = process.env.MODE as 'DEV' | 'PROD';
    const chains = [
      {
        chain: 'avax' as Chain,
        scannerApiKey: process.env.SNOWTRACE_API_KEY,
        scanner: 'snowtrace' as Provider,
      },
      {
        chain: 'polygon' as Chain,
        scannerApiKey: process.env.POLYGONSCAN_API_KEY,
        scanner: 'polygonscan' as Provider,
      },
      {
        chain: 'eth' as Chain,
        scannerApiKey: process.env.ETHERSCAN_API_KEY,
        scanner: 'etherscan' as Provider,
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
    const transactions = await client.getTransactionHistory(
      filterParams.from !== 'beginning'
        ? {
            from: {
              custodialProviders: filterParams.from.custodialProviders,
              selfCustodialProviders: filterParams.from.selfCustodialProviders,
            },
          }
        : { from: 'beginning' }
    );
    return res.status(200).json({
      transactions: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
