import {HardhatUserConfig} from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";
dotenv.config({path: __dirname + "/.env"});
const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.0",
            },
            {
                version: "0.8.1",
            },
        ],
    },
    networks: {
        goerli: {
            url: process.env.RPC_GOERLI,
            accounts: [process.env.PRIVATE_KEY as string],
            chainId: 5,
        },
        ethereum: {
            url: process.env.RPC_ETHMAINNET,
            accounts: [process.env.PRIVATE_KEY as string],
            chainId: 1,
        },
        mumbai: {
            url: process.env.RPC_MUMBAI,
            accounts: [process.env.PRIVATE_KEY as string],
            chainId: 80001,
        },
        polygon: {
            url: process.env.RPC_POLYGON,
            accounts: [process.env.PRIVATE_KEY as string],
            chainId: 137,
        },
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY as string,
            goerli: process.env.ETHERSCAN_API_KEY as string,
            polygon: process.env.POLYGONSCAN_API_KEY as string,
            polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
        },
    },
    gasReporter: {
        enabled: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        outputFile: "gas-report.txt",
        currency: "USD",
        token: "MATIC",
        noColors: true,
    },
};

export default config;
