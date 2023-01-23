## Positions connector

Is a package entended to be used with multiple web3 and web2 providers to interact with blockchains.

## Get Started

```javascript
import Connector from '@bloom-trade/finance-connector';

const credentials = [
  //etherscan example
  {
    addresses: ['0xF274800E82717D38d2e2ffe18A4C6489a50C5Add'],
    chain: 'eth',
    provider: {
      id: 'etherscan',
      useTestnet: true,
      auth: {
        apiKey: 'YOUR API KEY',
      },
    },
  },
  //circle api example
  {
    provider: {
      id: 'circle',
      useTestnet: true,
      auth: {
        apiKey: 'your api key',
      },
    },
  },
];
const connector = new Connector();
const client = connector.getClient(credentials);
client.getBalance().then((balance) => {
  //your balance
  console.log(balance);
});

client.getTransactionHistory().then((history) => {
  //your transaction history
  console.log(history);
});
```
