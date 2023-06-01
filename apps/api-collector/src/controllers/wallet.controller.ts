// Uncomment these imports to begin using these cool features!

import {get, param, post, requestBody, response} from '@loopback/rest';
import {Chain, Provider} from '@bloom-trade/types';
import Connector from '@bloom-trade/finance-connector';
import {
  ProviderCredentials,
  Balance,
} from '@bloom-trade/finance-connector/dist/@types';
// import {inject} from '@loopback/core';
import {ApiResponse} from '../@types/index';

interface IProvidersRequest {
  type: 'circle' | 'binance' | 'coinbase';
  auth: {
    apiKey?: string;
    apiSecret?: string;
  };
}

export class WalletController {
  constructor() {}
  @post('/wallet/balance')
  @response(200, {
    description: 'Balance model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              default: 'Balance fetched successfully',
            },
            data: {
              type: 'object',
              properties: {
                asset: {
                  type: 'string',
                },
                balance: {
                  type: 'number',
                },
                description: {
                  type: 'string',
                },
                detail: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      address: {
                        type: 'string',
                      },
                      provider: {
                        type: 'string',
                      },
                      chain: {
                        type: 'string',
                      },
                      balance: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            status: {
              type: 'number',
              default: 200,
            },
          },
        },
      },
    },
  })
  async getBalance(
    @param.query.string('testnet') testnet: string,
    @param.query.string('stableCoins') stableCoins: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              addresses: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              providers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                    },
                    auth: {
                      type: 'object',
                      properties: {
                        apiKey: {
                          type: 'string',
                        },
                        apiSecret: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
              chains: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    })
    body: {
      addresses: string[];
      providers?: IProvidersRequest[];
      chains: Chain[];
    },
  ): Promise<ApiResponse<Balance>> {
    const connector = new Connector();
    const circleCreds = body.providers
      ? body.providers.find(provider => provider.type === 'circle')
      : null;
    const mode = process.env.MODE as 'DEV' | 'PROD';
    let providerChains: {
      chain: Chain;
      scannerApiKey: string | undefined;
      scanner: Provider;
    }[] = [];
    if (!body.chains || body.chains.length === 0) {
      providerChains = [
        {
          chain: 'avax' as Chain,
          scannerApiKey: process.env.SNOWTRACE_API_KEY,
          scanner: 'snowtrace' as Provider,
        },
        {
          chain: 'eth' as Chain,
          scannerApiKey: process.env.ETHERSCAN_API_KEY,
          scanner: 'etherscan' as Provider,
        },
        {
          chain: 'polygon' as Chain,
          scannerApiKey: process.env.POLYGONSCAN_API_KEY,
          scanner: 'polygonscan' as Provider,
        },
      ];
    } else {
      body.chains.forEach((chain: Chain) => {
        providerChains.push({
          chain: chain as Chain,
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
    if (body.addresses && body.addresses.length > 0) {
      providerChains.forEach(({chain, scanner, scannerApiKey}) => {
        providerCreds.push({
          addresses: body.addresses,
          chain: chain,
          provider: {
            useTestnet: testnet
              ? testnet === 'true'
                ? true
                : false
              : mode === 'DEV'
              ? true
              : false,
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
          useTestnet: testnet
            ? testnet === 'true'
              ? true
              : false
            : mode === 'DEV'
            ? true
            : false,
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
        coin =>
          coin.asset.includes('usdc') ||
          coin.asset.includes('dai') ||
          coin.asset.includes('usdt'),
      );
    }
    return {
      data: balance,
      message: 'Balance fetched successfully',
      status: 200,
    };
  }
}
