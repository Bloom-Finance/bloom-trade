# Utilities

# [@bloom-trade/utilities](https://www.npmjs.com/package/@bloom-trade/utilities '@bloom-trade/utilities')

Is a package entended to format currencies,numbers, and other utilities.

## Installation 🧵

```bash
npm install @bloom-trade/utilities
```

## Web3 module

This set of functions are used to check whatever thing that is related to web3, blockchain, tokens, contracts, etc.

### Supported chains and tokens

| Chain   | Testnet | Stablecoins   |
| ------- | ------- | ------------- |
| eth     | goerli  | usdc,dai,usdt |
| polygon | mumbai  | usdc,dai,usdt |
| avax    | fuji    | usdc,dai,usdt |

### isWeb3WalletByAddress

Takes a possible web3 blockchain and validates if it is a valid web3 wallet address. (based on ethereum address format)

```typescript
import { isWeb3WalletByAddress } from '@bloom-trade/utilities';

const myAddress = '0x1145AE4E5bD546A485A0529faB0AC751c7709339';

isWeb3WalletByAddress(myAddress); // true
isWeb3WalletByAddress(aGVsbG8gd29ybGQ=); // false
```

### formatWalletAddress

Its unique argument is a wallet and formats it to be displayed in the typical web3 wallet format.

```typescript
import { formatWalletAddress } from '@bloom-trade/utilities';

const myAddress = '0x1145AE4E5bD546A485A0529faB0AC751c7709339';

formatWalletAddress(myAddress); // 0x...339
```

### getWagmiInstanceByChainName

This is a function that returns a wagmi instance based on the chain name.
Works either with testnets or mainnets.
Chain params are specified in the [@bloom-trade/types](https://www.npmjs.com/package/@bloom-trade/types '@bloom-trade/types') package.

```typescript
import { getWagmiInstanceByChainName } from '@bloom-trade/utilities';

const myChain = 'goerli';

getWagmiInstanceByChainName(myChain); //returns goerli wagmi instance
```

### getTokenContractMetadataBySymbolAndChain

- Returns the token contract metadata based on the symbol and chain name of an stablecoin token.
- Works either with testnets or mainnets.

```typescript
import { getTokenContractMetadataBySymbolAndChain } from '@bloom-trade/utilities';

getWagmiInstanceByChainName('usdc', 'goerli'); //returns goerli usdc contract address and decimals
```

### getTokenIconBySymbol

- Returns the token icon based on the symbol of an stablecoin token.
- Images are collected from [coinmarketcap](https://coinmarketcap.com/ 'coinmarketcap').

```typescript
import { getTokenIconBySymbol } from '@bloom-trade/utilities';

getTokenIconBySymbol('usdc'); //returns usdc icon
```

### getTokenDescriptionBySymbol

- Returns the token description based on the symbol of an stablecoin token.

```typescript
import { getTokenDescriptionBySymbol } from '@bloom-trade/utilities';

getTokenDescriptionBySymbol('usdc'); //USD coin
```

### getBloomContractsByChain

- It returns the bloom contract address for a given chain and type

```typescript
import { getBloomContractsByChain } from '@bloom-trade/utilities';

getBloomContractsByChain('eth', 'transfers'); //returns the bloom transfers contract address
```

### convertTokenToDecimalsUnit

- It takes a token value and the number of decimals and returns the token value in its smallest unit

```typescript
import { convertTokenToDecimalsUnit } from '@bloom-trade/utilities';

convertTokenToDecimalsUnit('1000000000000000000', '18'); //1
```

### convertDecimalsUnitToToken

- It converts a decimal value to a token value

```typescript
import { convertDecimalsUnitToToken } from '@bloom-trade/utilities';

convertDecimalsUnitToToken('1', '18'); //1000000000000000000
```

### getWalletBlockchainExplorer

- It returns a URL to a blockchain explorer for a given address and chain

```typescript
import { getWalletBlockchainExplorer } from '@bloom-trade/utilities';

getWalletBlockchainExplorer(
  '0xF274800E82717D38d2e2ffe18A4C6489a50C5Add',
  'eth'
); //https://etherscan.io/address/0xf274800e82717d38d2e2ffe18a4c6489a50c5add
```

### getBlockchainExplorerName

- It returns the name of the blockchain explorer for a given chain

```typescript
import { getBlockchainExplorerName } from '@bloom-trade/utilities';

getBlockchainExplorerName('eth'); //etherscan
```

### getTxDetailsBlockchainExplorer

- It returns a URL to a blockchain explorer for a given transaction hash and chain

```typescript
import { getTxDetailsBlockchainExplorer } from '@bloom-trade/utilities';

getTxDetailsBlockchainExplorer(
  '0x31d2567558080cf0a4902e58fd56709bc5df35488d2c4289bd9fbff3afe70470',
  'eth'
); //https://etherscan.io/tx/0x31d2567558080cf0a4902e58fd56709bc5df35488d2c4289bd9fbff3afe70470
```

### getGnosisService

- It returns a Gnosis Safe service based on the chain passed in

```typescript
import { getGnosisService } from '@bloom-trade/utilities';

getGnosisService('eth'); //https://safe-transaction.mainnet.gnosis.io/
```

### getMainnetFromTestnet

- Given a testnet, return the mainnet it's based on.

```typescript
import { getMainnetFromTestnet } from '@bloom-trade/utilities';

getMainnetFromTestnet('goerli'); // returns eth
```

### isTestnet

- `isTestnet` returns `true` if the chain is a testnet, and `false` if it's not

```typescript
import { isTestnet } from '@bloom-trade/utilities';

isTestnet('goerli'); // returns true
isTestnet('polygon'); // returns false
```

## Strings module

This set of functions are mainly intended to format strings, string numbers, currencies and other utilities such as dates with moment.

### isBase64

```typescript
import { isBase64 } from '@bloom-trade/utilities';

isBase64('aGVsbG8gd29ybGQ'); //true
```

### fromBase64

- It takes a base64 string and returns the decoded string

```typescript
import { fromBase64 } from '@bloom-trade/utilities';

fromBase64('aGVsbG8gd29ybGQ'); // decoded data
```

### stringToMilisecondsDate

Takes a string formatted date and turns it into miliseconds date from 1970.

```typescript
import { isBase64 } from '@bloom-trade/utilities';

stringToMilisecondsDate('January 1, 1970 00:00:00'); //0
```

### sumTwoFloatingStrings

Takes two floating strings and returns the sum of them. Useful when working with ethers.js and big numbers.

- Params are: string1, string2, decimals

```typescript
import { sumTwoFloatingStrings } from '@bloom-trade/utilities';

sumTwoFloatingStrings('0.1', '0.2', 3); //0.300
```

## Numbers Module

This set of functions are mainly intended to format numbers, currencies and other utilities such as dates with moment.

| Function       | Paramaters                   | Description                                                                        | Returns |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------------- | ------- |
| fCurrency      | string or number             | Formats a number or string into a currenct type                                    | string  |
| fPercent       | number                       | Returns a number in a percentage type                                              | string  |
| fNumber        | string or number             | It takes a number or a string and returns a formatted number                       | number  |
| fShortenNumber | string or number             | Returns a string that is a shortened version of the number.                        | string  |
| fData          | string or number             | If the number is a string, format it as a number, otherwise format it as a number. | string  |
| fUnixDate      | number                       | It takes a unix timestamp and returns a formatted date                             | string  |
| fDate          | number and format (optional) | Returns a formmated date depending on the format given                             | string  |

## Handlers

A set of functions that mainly handle errors

### errorHandler

This function is used to handle errors in a more elegant way. It takes an error and a callback function that will be executed if the error is not null.

- Params are: error, alertParams, callbackParams
- Returns a BloomError of Type T ( the one you specify in the errorHandler function)

```typescript
import { errorHandler } from '@bloom-trade/utilities';

type BloomError<T> = {
  isError: true;
  code?: number | undefined;
  msg?: string | undefined;
  unknown?: boolean | undefined;
  errorObj?: T | undefined;
};

async function myFunction() {
  try {
    const response = await axios.get('api/users');
    console.log(response);
  } catch (error) {
    errorHandler<{ data: { message: string } }>(
      error,
      (message, type, callback) => {
        console.log(message, type, callback);
        //Implement your alert here
      },
      () => {
        console.log('callback');
      }
    ); // Returns BloomError<{data:{message:string}}>
  }
}
```

## Data processors

A set of complex functions in charge of processing data.

### getLatestBlocksAndDatesByTx

Depending of transaction of type Transaction (refer to [@bloom-trade/types](https://www.npmjs.com/package/@bloom-trade/types '@bloom-trade/types') package) it returns the latest block and date of the transaction.

### getWeeklyIncome

Depending of an array transactions of type Transaction (refer to [@bloom-trade/types](https://www.npmjs.com/package/@bloom-trade/types '@bloom-trade/types') package) it returns the weekly income of the user.

### getWeeklyOutcome

Depending of an array transactions of type Transaction (refer to [@bloom-trade/types](https://www.npmjs.com/package/@bloom-trade/types '@bloom-trade/types') package) it returns the weekly outcome of the user.
