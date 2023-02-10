import { ProviderConnector } from '../connector';
import { IProviderConnector, Balance } from '../../@types/index';
import axios from 'axios';
import {
  convertToken,
  getAssetDataByChain,
  getDescription,
  getSupportedContracts,
  weiToEth,
} from '../../utils';
import Web3 from 'web3';
import { Asset, Chain, Provider, Transaction } from '@bloom-trade/types';
export class ProviderConnectorImpl
  extends ProviderConnector
  implements IProviderConnector
{
  async getBalance(): Promise<
    {
      asset: string;
      balance: string;
      description: string;
      detail: {
        address: string;
        provider: string;
        chain: string;
        balance: string;
      }[];
    }[]
  > {
    const apiKey = this._credentials.apiKey;
    const balance: Balance = [];
    const contracts = getSupportedContracts();
    if (!this.addresses) {
      return [] as any;
    }
    for (const address of this.addresses) {
      if (
        !balance.find((e) => {
          if (
            e.detail.find((e) => e.address === address) &&
            e.asset === 'eth'
          ) {
            return e;
          }
        })
      ) {
        const { data } = await axios.get(
          `${this._baseurl}?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
        );
        //TODO: Wei convertion
        const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        if (data.result !== '0') {
          balance.push({
            asset: 'eth',
            description: 'Ethereum',
            balance: web3.utils.fromWei(data.result, 'ether'),
            detail: [
              {
                address,
                provider: this._provider.id,
                chain: this.chain as string,
                balance: web3.utils.fromWei(data.result, 'ether'),
              },
            ],
          });
        }
      }
      for (const contract of contracts) {
        const { data } = await axios.get(
          `${
            this._baseurl
          }?module=account&action=tokenbalance&contractaddress=${
            getAssetDataByChain(contract, this.chain as Chain, this._provider)
              .address
          }&address=${address}&tag=latest&apikey=${apiKey}`
        );
        if (data.result !== '0') {
          let retrievedBalance;
          if (
            getAssetDataByChain(contract, this.chain as Chain, this._provider)
              .decimalPosition === 18
          ) {
            retrievedBalance = weiToEth(data.result);
          } else {
            retrievedBalance = convertToken(
              data.result,
              getAssetDataByChain(contract, this.chain as Chain, this._provider)
                .decimalPosition
            );
          }
          balance.push({
            asset: contract.token.toLowerCase(),
            description: getDescription(contract.token),
            balance: retrievedBalance,
            detail: [
              {
                address,
                provider: this._provider.id,
                chain: this.chain as string,
                balance: retrievedBalance,
              },
            ],
          });
        }
        continue;
      }
    }
    return balance as any;
    //staff
  }
  async getTransactionHistory(filters: {
    from:
      | 'beginning'
      | {
          selfCustodialProviders?: {
            chain: Chain;
            block: number;
          }[];
          custodialProviders?: {
            id: Provider;
            block?: number;
            date: number; //NOT IN UNIX TIMESTAMP
          }[];
        };
  }) {
    const apiKey = this._credentials.apiKey;
    const contracts = getSupportedContracts();
    if (!this.addresses) {
      return [] as any;
    }
    const transactions: Transaction[] = [];
    let startingBlock = 0;
    for (const address of this.addresses) {
      if (
        filters.from !== 'beginning' &&
        filters.from.selfCustodialProviders &&
        filters.from.selfCustodialProviders.length > 0 &&
        filters.from.selfCustodialProviders.filter(
          (provider) => provider.chain === this.chain
        ).length > 0
      ) {
        //Check if eth is included otherwise use from block 0
        const ethIncluded = (filters.from as any).selfCustodialProviders.find(
          (e) => e.chain === 'eth'
        );
        startingBlock = ethIncluded.block;
      }
      const {
        data: { result: ethTransactions },
      } = await axios.get(
        `${this._baseurl}?module=account&action=txlist&address=${address}&startblock=${startingBlock}&endblock=99999999&tag=latest&apikey=${apiKey}`
      );
      for (const e of ethTransactions) {
        if (e instanceof Object && e.value !== '0') {
          const lowerCaseAddress = address.toLowerCase();
          const lowerCaseFrom = e.from.toLowerCase();
          const obj: Transaction = {
            asset: 'eth',
            from: e.from,
            to: e.to,
            amount: weiToEth(e.value),
            type: lowerCaseAddress != lowerCaseFrom ? 'in' : 'out',
            status: e.isError === '0' ? 'completed' : 'failed',
            timestamp: parseInt(e.timeStamp) * 1000,
            provider: this._provider.id as Provider,
            chain: this.chain as Chain,
            block: e.blockNumber,
          };
          if (lowerCaseAddress == lowerCaseFrom) {
            Object.assign(obj, {
              gas: e.gas,
              gasPrice: e.gasPrice,
              gasUsed: e.gasUsed,
            });
          }
          transactions.push(obj);
        }
      }
      for (const contract of contracts) {
        const {
          data: { result: ERC20Transactions },
        } = await axios.get(
          `${this._baseurl}?module=account&action=tokentx&contractaddress=${
            getAssetDataByChain(contract, this.chain as Chain, this._provider)
              .address
          }&address=${address}&startblock=${startingBlock}&endblock=99999999&tag=latest&apikey=${apiKey}`
        );
        for (const e of ERC20Transactions) {
          if (e instanceof Object && e.value !== '0') {
            const lowerCaseAddress = address.toLowerCase();
            const lowerCaseFrom = e.from.toLowerCase();
            const obj: Transaction = {
              asset: contract.token.toLowerCase() as Asset,
              from: e.from,
              to: e.to,
              amount: convertToken(
                e.value,
                getAssetDataByChain(
                  contract,
                  this.chain as Chain,
                  this._provider
                ).decimalPosition
              ),
              type: lowerCaseAddress !== lowerCaseFrom ? 'in' : 'out',
              status:
                lowerCaseAddress !== lowerCaseFrom ? 'in' : ('out' as any),
              timestamp: parseInt(e.timeStamp) * 1000,
              provider: this._provider.id as Provider,
              chain: this.chain as Chain,
              block: e.blockNumber,
            };
            if (lowerCaseAddress === lowerCaseFrom) {
              Object.assign(obj, {
                gas: e.gas,
                gasPrice: e.gasPrice,
                gasUsed: e.gasUsed,
              });
            }
            transactions.push(obj);
          }
        }
      }
    }
    return transactions;
  }
}
