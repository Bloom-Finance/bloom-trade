import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import VaultDetail from '../detail'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Organism/Vault/Detail',
  component: VaultDetail,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof VaultDetail>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VaultDetail> = (args) => <VaultDetail {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  isConnected: true,
  connectedWalletAddress: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
  isWalletVerified: true,
  vault: {
    id: '2323sdw2',
    user: '1212',
    chain: 'eth',
    address: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
    owners: ['0xF274800E82717D38d2e2ffe18A4C6489a50C5Add'],
    balance: [{ asset: 'usdc', amount: '121' }],
    threshold: 1,
  },
  vaultTransactions: [
    {
      blockNumber: 8536551,
      data: '0xa9059cbb000000000000000000000000e14d7b23b9239abda519a300d530707689019f4e00000000000000000000000000000000000000000000000029a2241af62c0000',
      executionDate: '2023-02-22T13:14:48Z',
      from: '0xD130d1ebB6881dBD2643df32170a45B65075433e',
      to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
      transfers: [
        {
          blockNumber: 8536551,
          executionDate: '2023-02-22T13:14:48Z',
          from: '0xD130d1ebB6881dBD2643df32170a45B65075433e',
          to: '0xe14D7b23B9239ABda519A300D530707689019F4e',
          tokenAddress: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
          tokenId: '',
          tokenInfo: {
            address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
            decimals: 18,
            logoUri:
              'https://safe-transaction-assets.safe.global/tokens/logos/0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844.png',
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            type: 'ERC20',
          },
          transactionHash: '0x790840c49434d2541494388562263916d8f3f9b19dae0948399c3187d5a62ce6',
          type: 'ERC20_TRANSFER',
          value: '3000000000000000000',
        },
      ],
      txHash: '0x790840c49434d2541494388562263916d8f3f9b19dae0948399c3187d5a62ce6',
      txType: 'ETHEREUM_TRANSACTION',
    },
    {
      baseGas: 0,
      blockNumber: 8531710,
      confirmations: [
        {
          owner: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
          signature:
            '0x000000000000000000000000f274800e82717d38d2e2ffe18a4c6489a50c5add000000000000000000000000000000000000000000000000000000000000000001',
          signatureType: 'APPROVED_HASH',
          submissionDate: '2023-02-21T17:05:09.180913Z',
          transactionHash: '',
        },
      ],
      txType: 'MULTISIG_TRANSACTION',
      transfers: [
        {
          blockNumber: 8531710,
          executionDate: '2023-02-21T17:06:00Z',
          from: '0xe14D7b23B9239ABda519A300D530707689019F4e',
          to: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
          tokenAddress: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
          tokenId: '',
          tokenInfo: {
            address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
            decimals: 18,
            logoUri:
              'https://safe-transaction-assets.safe.global/tokens/logos/0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844.png',
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            type: 'ERC20',
          },
          transactionHash: '0x379c9a65c325fad695e9ade932b350f8a90bf82bd6ea2d3cc96117b0d2fd2ea6',
          type: 'ERC20_TRANSFER',
          value: '3000000000000000000',
        },
      ],
      value: '0',
      confirmationsRequired: 1,
      data: '0xa9059cbb000000000000000000000000f274800e82717d38d2e2ffe18a4c6489a50c5add00000000000000000000000000000000000000000000000029a2241af62c0000',
      ethGasPrice: '64178032515',
      executionDate: '2023-02-21T17:06:00Z',
      executor: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
      fee: 4205137224480345,
      gasPrice: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      gasUsed: 65523,
      isExecuted: true,
      isSuccessful: true,
      modified: '2023-02-21T17:06:05.054796Z',
      nonce: 1,
      operation: 0,
      origin: '{}',
      refundReceiver: '0x0000000000000000000000000000000000000000',
      safe: '0xe14D7b23B9239ABda519A300D530707689019F4e',
      safeTxGas: 0,
      safeTxHash: '0x8583ef28c0a0d2b53097956f4db15f3a51f5f07e32f8842558072f06c68d88bc',
      signatures:
        '0x000000000000000000000000f274800e82717d38d2e2ffe18a4c6489a50c5add000000000000000000000000000000000000000000000000000000000000000001',
      submissionDate: '2023-02-21T17:04:44.868821Z',
      to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
      transactionHash: '0x379c9a65c325fad695e9ade932b350f8a90bf82bd6ea2d3cc96117b0d2fd2ea6',
    },
  ],
  pendingTransactions: [
    {
      safeTxHash: '0x5b23339f69d2dfdb7f88cc3a694c7e5d5d81bb7c91f2a55c7f794d5af5a5a5a5',
      isExecuted: true,
      safe: '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
      to: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
      value: '0',
      data: '0xa9059cbb000000000000000000000000f274800e82717d38d2e2ffe18a4c6489a50c5add00000000',
      baseGas: 0,
      gasPrice: '0',
      safeTxGas: 0,
      executionDate: '2023-02-21T17:06:00Z',
      modified: '2023-02-21T17:06:05.054796Z',
      nonce: 1,
      transactionHash: '0x379c9a65c325fad695e9ade932b350f8a90bf82bd6ea2d3cc96117b0d2fd2ea6',
      origin: '',
      confirmations: [
        {
          owner: '0x8bf01d2940b23697a2300e4f4f7b0be054d62c61',
          submissionDate: '2023-02-21T17:05:09.180913Z',
          signature: '0x0000000000000000000000008bf01d2940b23697a2300e4f4f7b0be054d62c610',
        },
      ],
      confirmationsRequired: 3,
      signatures: '0x0000000000000000000000008bf01d2940b23697a2300e4f4f7b0be054d62c610',
      submissionDate: '2023-02-21T17:05:09.180913Z',
      executor: '0x9c9e1d04b8a604a1d880bef6d2f6a372b6e786c6',
      gasToken: '0x55d3942d137606e7',
      refundReceiver: '0xa1c3e1596d3d8e8f30b59f69d2dfdb7f88cc3a69',
      operation: 0,
    },
  ],
}
