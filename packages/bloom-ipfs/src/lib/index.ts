import { Ipfs } from '@bloom-trade/types';
import { IPFS, create } from 'ipfs-core';
import { create as createHttp, CID } from 'ipfs-http-client';
class BloomIpfs implements Ipfs.BloomIpfsSdk {
  private mode: 'LOCAL' | 'INFURA';
  private ipfs: IPFS;
  private infuraConfig?: {
    projectId: string;
    projectSecret: string;
  };

  private constructor(config: {
    ipfs: IPFS;
    mode: 'LOCAL' | 'INFURA';
    infuraConfig?: {
      projectId: string;
      projectSecret: string;
    };
  }) {
    this.mode = config.mode;
    this.infuraConfig = config.infuraConfig;
    this.ipfs = config.ipfs;
  }
  /**
   * It creates an IPFS node and returns it
   * @param config - {
   * @returns A new instance of BloomIpfs
   */
  static async create(config: {
    mode: 'LOCAL' | 'INFURA';
    infuraConfig?: {
      projectId: string;
      projectSecret: string;
    };
  }): Promise<BloomIpfs> {
    if (config.mode === 'LOCAL') {
      const ipfs = await create();
      return new BloomIpfs({ ...config, ipfs });
    } else if (config.mode === 'INFURA' && config.infuraConfig) {
      const auth =
        'Basic ' +
        Buffer.from(
          config.infuraConfig.projectId +
            ':' +
            config.infuraConfig.projectSecret
        ).toString('base64');

      const ipfs = createHttp({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth,
        },
      });

      return new BloomIpfs({ ...config, ipfs });
    } else {
      throw new Error('Invalid params');
    }
  }
  async get(cid: CID): Promise<Record<string, any>> {
    if (!this.ipfs) throw new Error('No IPFS instance');
    let string;
    for await (const buf of this.ipfs.cat(cid)) {
      string = Buffer.from(buf).toString('utf-8');
    }
    return JSON.parse(string);
  }
  async save(payload: Record<string, any>): Promise<CID> {
    if (!this.ipfs) throw new Error('No IPFS instance');
    const { cid } = await this.ipfs.add(JSON.stringify(payload));
    return cid;
  }
}

export default BloomIpfs;
