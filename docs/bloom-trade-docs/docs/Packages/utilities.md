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

### getTokenContractAddressBySymbolAndChain

- Returns the token contract address and decimals based on the symbol and chain name of an stablecoin token.
- Works either with testnets or mainnets.

```typescript
import { getTokenContractAddressBySymbolAndChain } from '@bloom-trade/utilities';

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

## Strings module

This set of functions are mainly intended to format strings, string numbers, currencies and other utilities such as dates with moment.

### isBase64

```typescript
import { isBase64 } from '@bloom-trade/utilities';

isBase64('aGVsbG8gd29ybGQ'); //true
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
