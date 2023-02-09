# Order Receipts

Bloom's Token Swapper is a simple contract that allows users mint nfts with their orders and receipts.

## Testing 🧪

All testing is done using [Goerli Testnet 🔗](https://goerli.etherscan.io/)

### Last stable testnet contract for GOERLI ⚙️

- [Bloom Order Receipts 🔄](https://goerli.etherscan.io/address/0x025c233a133126FE0386e6580F0D52F984ECfA14): 0x025c233a133126FE0386e6580F0D52F984ECfA14

### How to use 🤔

1.  Create your own .env file
2.  Add the specified keys to your .env file
3.  Run `yarn install` or `npm install`
4.  Run the following command to compile and deploy the contract:

```shell
npx hardhat compile
npm run deploy:goerli
```

### Environment variables 📝

| Item                  |                                                  Value |
| --------------------- | -----------------------------------------------------: |
| RPC_GOERLI            |         Add your alchemy RPC server for goerli testnet |
| RPC_MUMBAI            | Add your alchemy RPC server for mumbai polygon testnet |
| RPC_ETHMAINNET        |       Add your alchemy RPC server for ethereum mainnet |
| RPC_POLYGON           |        Add your alchemy RPC server for polygon mainnet |
| ETHERSCAN_API_KEY     |                          API Key provided by etherscan |
| POLYGONSCAN_API_KEY   |                        API Key provided by polygonscan |
| PRIVATE_KEY           |                                Your wallet private key |
| COINMARKETCAP_API_KEY |                        In case you want the gas-report |
