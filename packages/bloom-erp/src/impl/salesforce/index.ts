import { Invoice } from '../../@types';
import { ERPConnector } from '../credentials';
export class ERPConnectorImpl extends ERPConnector {
  getInvoice(id: string): Promise<Invoice> {
    console.log(this._credentials);
    console.log('testing from salesforce');
    return Promise.resolve({} as Invoice);
  }
}
