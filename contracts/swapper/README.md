# Token Swapper

Bloom's Token Swapper is a simple contract that allows users to swap between the same chain

For more information visit [Uniswap docs ๐ฆ](https://docs.uniswap.org/)

### Supported tokens ๐ฐ

-   ETH
-   MATIC
-   USDT
-   USDC
-   DAI

## Testing ๐งช

All testing is done using [Goerli Testnet ๐](https://goerli.etherscan.io/)

### Last stable testnet contracts for GOERLI โ๏ธ

-   [SWAPPER ๐](https://goerli.etherscan.io/address/0x067e55e43dFc70515e622035675f48A11C2BB031): 0x067e55e43dFc70515e622035675f48A11C2BB031
-   [TREASURE ๐ค](https://goerli.etherscan.io/address/0x7fa5C52E91aa82A05B68Fb8e5450213E9c17Be3a): 0x7fa5C52E91aa82A05B68Fb8e5450213E9c17Be3a
-   [TRANSFERS ๐ธ](https://goerli.etherscan.io/address/0x5EE0685b721711C1417b8494eC7B1A8A207ccCa3): 0x5EE0685b721711C1417b8494eC7B1A8A207ccCa3

### Last stable testnet contracts for MUMBAI ๐ฃ

-   [SWAPPER ๐](https://mumbai.polygonscan.com/address/0xf74bEC67585bfda41d38e115ad013eb9cD2895b7): 0xf74bEC67585bfda41d38e115ad013eb9cD2895b7
-   [TREASURE ๐ค](https://mumbai.polygonscan.com/address/0x21d1A21859cad13ac5ae6619D4FE6AFC10156Cc9): 0x21d1A21859cad13ac5ae6619D4FE6AFC10156Cc9
-   [TRANSFERS ๐ธ](https://mumbai.polygonscan.com/address/0xD36c225B9E5d12DFe03b358D8B7590f044e4449A): 0xD36c225B9E5d12DFe03b358D8B7590f044e4449A

### Last stable testnet contracts for Polygon ๐ฎ

-   [SWAPPER ๐](https://polygonscan.com/address/0x034D2685049c4B04AF0e5cb3b196331D8Aa80931): 0x034D2685049c4B04AF0e5cb3b196331D8Aa80931
-   [TREASURE ๐ค](https://polygonscan.com/address/0x20BEBF54ef1c222BfA1CF565cFB58240751Dc7DB): 0x20BEBF54ef1c222BfA1CF565cFB58240751Dc7DB
-   [TRANSFERS ๐ธ](https://polygonscan.com/address/0x7Ea9a426D9a5483595d47872f8863dfF006E593C): 0x7Ea9a426D9a5483595d47872f8863dfF006E593C

## Ethereum ๐

### Contract addresses for Goerli Testnet

| Tokens |                                  Addresses |
| ------ | -----------------------------------------: |
| DAI    | 0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844 |
| USDT   | 0x2DB274b9E5946855B83e9Eac5aA6Dcf2c68a95F3 |
| USDC   | 0x07865c6E87B9F70255377e024ace6630C1Eaa37F |

### Contract addresses for ERC20 Mainnet

| Tokens |                                  Addresses |
| ------ | -----------------------------------------: |
| DAI    | 0x6B175474E89094C44Da98b954EedeAC495271d0F |
| USDT   | 0xdAC17F958D2ee523a2206206994597C13D831ec7 |
| USDC   | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |

## Polygon ๐ฎ

### Tokens contracts addresses for Mumbai Testnet

| Tokens |                                  Addresses |
| ------ | -----------------------------------------: |
| DAI    | 0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F |
| USDT   | 0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832 |
| USDC   | 0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747 |

### Tokens contracts addresses for POLYGON Mainnet

| Tokens |                                  Addresses |
| ------ | -----------------------------------------: |
| DAI    | 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063 |
| USDT   | 0xc2132D05D31c914a87C6611C10748AEb04B58e8F |
| USDC   | 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 |

### How to use ๐ค

1.  Create your own .env file
2.  Add the specified keys to your .env file
3.  Run `yarn install` or `npm install`
4.  Run the following command to compile and deploy the contract:

```shell
npx hardhat compile
npm run deploy:goerli
```

### Environment variables ๐

| Item                  |                                                   Value |
| --------------------- | ------------------------------------------------------: |
| RPC_GOERLI            |          Add your alchemy RPC server for goerli testnet |
| RPC_MUMBAI            |  Add your alchemy RPC server for mumbai polygon testnet |
| RPC_ETHMAINNET        |        Add your alchemy RPC server for ethereum mainnet |
| RPC_POLYGON           |         Add your alchemy RPC server for polygon mainnet |
| ETHERSCAN_API_KEY     |                           API Key provided by etherscan |
| POLYGONSCAN_API_KEY   |                         API Key provided by polygonscan |
| PRIVATE_KEY           |                                 Your wallet private key |
| COINMARKETCAP_API_KEY |                         In case you want the gas-report |
| CHAIN                 | Specify it for internal validation regarded to scanners |
