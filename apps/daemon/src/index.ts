import { ethers } from 'ethers';
const BLOOM_TRANSFERS = '0x0BB38d7E6dbD85432F27330f03A8311B3E8Ded32';
const provider = new ethers.JsonRpcProvider(
  'https://eth-sepolia.g.alchemy.com/v2/Xy1dwT2TBiAXoneRtByKtn0fgCuHPw-W'
);
const ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_dai', type: 'address' },
      { internalType: 'address', name: '_usdc', type: 'address' },
      { internalType: 'address', name: '_usdt', type: 'address' },
      { internalType: 'address', name: '_treasure', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'text', type: 'string' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'getTreasureAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'sendDAIToAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'sendNativeToAddress',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'sendUSDCToAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'sendUSDTTOAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const contract = new ethers.Contract(BLOOM_TRANSFERS, ABI, provider);
console.log('Hello World from nodemon');
contract.on('Transfer', (text) => {
  console.log(text);
  console.log('Called');
});
