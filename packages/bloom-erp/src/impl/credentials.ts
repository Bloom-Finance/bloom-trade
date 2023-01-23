import { erpCredentials } from '../@types';
export class ERPConnector {
  protected _credentials: erpCredentials<any>;
  constructor(creds: erpCredentials<any>) {
    this._credentials = creds;
  }
}
