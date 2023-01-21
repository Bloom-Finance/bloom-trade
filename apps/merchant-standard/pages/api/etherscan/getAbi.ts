// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { chainId, address } = req.query;
  switch (parseInt(chainId as string)) {
    case 5:
      //goerli
      const goerliAbi = await retrieveAbi(
        getUrlAndApiKeyByChainId(5).url,
        address as string,
        getUrlAndApiKeyByChainId(5).apiKey
      );
      return res.status(200).send(goerliAbi);
    case 80001:
      //goerli
      const mumbaiAbi = await retrieveAbi(
        getUrlAndApiKeyByChainId(80001).url,
        address as string,
        getUrlAndApiKeyByChainId(80001).apiKey
      );
      res.status(200).send(mumbaiAbi);
    case 137:
      //goerli
      const polygonAbi = await retrieveAbi(
        getUrlAndApiKeyByChainId(137).url,
        address as string,
        getUrlAndApiKeyByChainId(137).apiKey
      );
      res.status(200).send(polygonAbi);
    default:
      break;
  }
}

const retrieveAbi = async (url: string, address: string, apikey: string) => {
  try {
    const { data } = await axios.get(
      `${url}/api?module=contract&action=getabi&address=${address}&apikey=${apikey}`
    );
    return data.result;
  } catch (error) {
    throw new Error((error as any).message);
  }
};

const getUrlAndApiKeyByChainId = (chainId: number) => {
  switch (chainId) {
    case 5:
      return {
        url: 'https://api-goerli.etherscan.io',
        apiKey: process.env.ETHERSCAN_API_KEY as string,
      };
    case 80001:
      return {
        url: 'https://api-testnet.polygonscan.com/',
        apiKey: process.env.POLYGON_SCAN_API_KEY as string,
      };
    case 137:
      return {
        url: 'https://api.polygonscan.com/',
        apiKey: process.env.POLYGON_SCAN_API_KEY as string,
      };
    default:
      return {
        url: 'https://api-goerli.etherscan.io',
        apiKey: process.env.ETHERSCAN_API_KEY as string,
      };
  }
};
