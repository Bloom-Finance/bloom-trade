import { Ipfs } from '@bloom-trade/types';
import { IPFS, create } from 'ipfs-core';
import IpfsHttpClient from 'ipfs-http-client';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
class BloomIpfs implements Ipfs.BloomIpfsSdk {
  private seed: Uint8Array;
  private mode: 'LOCAL' | 'INFURA';
  private ipfs: IPFS;
  public did: DID;
  private infuraConfig?: {
    projectId: string;
    projectSecret: string;
  };

  private constructor(config: {
    ipfs: IPFS;
    did: DID;
    mode: 'LOCAL' | 'INFURA';
    seed: Uint8Array;
    infuraConfig?: {
      projectId: string;
      projectSecret: string;
    };
  }) {
    this.seed = config.seed;
    this.mode = config.mode;
    this.infuraConfig = config.infuraConfig;
    this.ipfs = config.ipfs;
    this.did = config.did;
  }
  static async create(config: {
    mode: 'LOCAL' | 'INFURA';
    seed: Uint8Array;
    infuraConfig?: {
      projectId: string;
      projectSecret: string;
    };
  }): Promise<BloomIpfs> {
    if (config.mode === 'LOCAL') {
      const ipfs = await create();
      const provider = new Ed25519Provider(config.seed);
      const did = new DID({
        provider,
        resolver: getResolver(),
      });
      await did.authenticate();
      return new BloomIpfs({ ...config, ipfs, did });
    } else if (config.mode === 'INFURA' && config.infuraConfig) {
      const auth =
        'Basic ' +
        Buffer.from(
          config.infuraConfig.projectId +
            ':' +
            config.infuraConfig.projectSecret
        ).toString('base64');

      const ipfs = IpfsHttpClient.create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth,
        },
      });
      const provider = new Ed25519Provider(config.seed);
      const did = new DID({
        provider,
        resolver: getResolver(),
      });
      await did.authenticate();
      return new BloomIpfs({ ...config, ipfs, did });
    } else {
      throw new Error('Invalid params');
    }
  }
  async decrypt(cid: IpfsHttpClient.CID): Promise<Record<string, any>> {
    const jwe = (await this.ipfs.dag.get(cid)).value;
    const clearText = await this.did.decryptDagJWE(jwe);
    return clearText;
  }
  async encrypt(payload: Record<string, any>): Promise<any> {
    if (this.ipfs) {
      const jwe = await this.did.createDagJWE(payload, [this.did.id]);
      return this.ipfs.dag.put(jwe, {
        storeCodec: 'dag-jose',
        hashAlg: 'sha2-256',
      });
    } else {
      throw new Error('No IPFS instance');
    }
  }
}

export default BloomIpfs;
