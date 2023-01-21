/* eslint-disable @typescript-eslint/no-var-requires */
import nano from 'nano';
import {
  Contabilium,
  CouchDBCredentials,
  Customer,
  IConnector,
  Invoice,
} from '../@types';
import {
  Client,
  ERPs,
  erpCredentials,
  Quickbooks,
  SalesForce,
} from '../@types';
import {
  getContabiliumClient,
  getQuickbooksClient,
  getSalesForceClient,
} from '../services/clients.service';
import CouchDB from '../services/couchdb.service';
class Connector implements IConnector {
  constructor() {
    //staff
  }
  /**
   * It saves the Quickbooks credentials to the database
   * @param credentials - Quickbooks.client
   */
  async setQuickbooksCredentials(
    credentials: Quickbooks.client
  ): Promise<nano.DocumentInsertResponse> {
    const couchdb = new CouchDB('admin0', 'alex1234', 'bloom-merchant');
    const res = await couchdb.updateCredentials(
      'jurassic-lake',
      'quickbooks',
      credentials
    );
    return res;
  }
  /**
   * It takes in an object of API credentials and an ERP name, and returns a URL if the ERP is
   * QuickBooks, otherwise it returns nothing
   * @param {any} apiCredentials - This is the object that contains the API credentials.
   * @param {ERPs} erp - ERPs - This is the ERP that you are using.
   * @returns A promise that resolves to a string or void.
   */
  async authenticate(apiCredentials: any, erp: ERPs): Promise<void | string> {
    const { auth } = require(`../impl/${erp}/auth`);
    if (erp === 'quickbooks') {
      const url = await auth(apiCredentials);
      return url;
    } else {
      await auth(apiCredentials);
    }
  }
  /**
   * It returns a promise that resolves to an object that has a property called `erp` that is of type
   * `T` and a property called `credentials` that is of type `erpCredentials<T>`
   * @param {T} erp - The ERP you want to get the credentials for.
   * @returns A promise that resolves to an object of type erpCredentials<T>
   */
  getCredentials<T extends ERPs>(erp: T): Promise<erpCredentials<T>> {
    // return rxDb.getCredentials(erp);
    return Promise.resolve({} as erpCredentials<T>);
  }
  isAuthenticated(): boolean {
    throw new Error('Method not implemented.');
  }
  /**
   * It returns a client object based on the ERP type.
   * @param credentials - erpCredentials<T>
   * @param {T} erp - T - this is the type of ERP you want to connect to.
   * @returns A client object
   */
  getClient<T extends ERPs>(
    credentials: erpCredentials<T>,
    erp: T,
    couchdb: CouchDBCredentials
  ): Client<
    T extends 'quickbooks'
      ? 'quickbooks'
      : T extends 'salesforce'
      ? 'salesforce'
      : 'contabilium'
  > {
    switch (erp) {
      case 'quickbooks':
        return getQuickbooksClient(
          credentials as Quickbooks.client,
          couchdb
        ) as any;
      case 'salesforce':
        return getSalesForceClient(
          credentials as SalesForce.client,
          couchdb
        ) as any;
      case 'contabilium':
        return getContabiliumClient(
          credentials as Contabilium.client,
          couchdb
        ) as any;
      default:
        throw new Error(`${erp} is not a valid ERP type`);
    }
  }
}

export default Connector;
