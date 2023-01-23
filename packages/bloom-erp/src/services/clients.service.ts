import { CouchDBCredentials, Customer } from '../@types/index';
import {
  Client,
  Invoice,
  erpCredentials,
  ERPs,
  Pagination,
  Sort,
  Filters,
} from '../@types';
import {
  getCustomer,
  getCustomers,
  getInvoice,
  getInvoices,
} from './erps.service';
import CouchDB from './couchdb.service';

/**
 * It takes in an object of credentials and an ERP type, and returns an object with a getInvoices and
 * getInvoice function
 * @param credentials - erpCredentials<T>
 * @param {T} type - ERPs - this is the type of ERP you're connecting to.
 * @returns A function that takes in a type and returns a client
 */
const setClient = <T extends ERPs>(
  credentials: erpCredentials<T>,
  type: T,
  couchdb: CouchDBCredentials
): Client<T> => {
  const creds: any = {
    erpType: type,
    erpCredentials: {
      ...credentials,
    },
  };
  const couchDbInstance = new CouchDB(
    couchdb.user,
    couchdb.password,
    couchdb.database
  );
  return {
    getInvoices(filters?: Filters, pagination?: Pagination, sort?: Sort) {
      return getInvoices(creds, filters, pagination, sort);
    },
    getInvoice(id: string) {
      return getInvoice(creds, id);
    },
    getCustomers(pagination: Pagination, sort: Sort) {
      return getCustomers(creds, pagination, sort);
    },
    getCustomer(id: string) {
      return getCustomer(creds, id);
    },
    ...creds,
    couchDB: {
      credentials: {
        ...couchdb,
      },
      async insertDocs(docs: Invoice[] | Customer[]) {
        docs.forEach(async (element) => {
          await couchDbInstance.insert(element);
        });
      },
      async updateCredentials(id: string, erpType: ERPs, credentials: any) {
        const res = await couchDbInstance.updateCredentials(
          id,
          erpType,
          credentials
        );
        return res;
      },
    },
  };
};

/**
 * It takes in a set of credentials for a specific ERP, and returns a client object that can be used to
 * make requests to that ERP
 * @param credentials - erpCredentials<'quickbooks'>
 * @param {CouchDBCredentials} couchdb - CouchDBCredentials
 * @returns A function that takes in a credentials object and a couchdb object and returns a client
 * object.
 */
const getQuickbooksClient = (
  credentials: erpCredentials<'quickbooks'>,
  couchdb: CouchDBCredentials
): Client<'quickbooks'> => {
  return setClient(credentials, 'quickbooks', couchdb);
};

/**
 * It takes in a set of credentials for a specific ERP, and returns a client object that can be used to
 * interact with that ERP
 * @param credentials - erpCredentials<'salesforce'>
 * @param {CouchDBCredentials} couchdb - CouchDBCredentials
 * @returns A function that takes in a credentials object and a couchdb object and returns a client
 * object.
 */
const getSalesForceClient = (
  credentials: erpCredentials<'salesforce'>,
  couchdb: CouchDBCredentials
): Client<'salesforce'> => {
  return setClient(credentials, 'salesforce', couchdb);
};

/**
 * It takes in a set of credentials for the ERP and for the CouchDB database, and returns a client
 * object that can be used to interact with the ERP
 * @param credentials - erpCredentials<'contabilium'>
 * @param {CouchDBCredentials} couchdb - CouchDBCredentials
 * @returns A function that returns a Client object.
 */
const getContabiliumClient = (
  credentials: erpCredentials<'contabilium'>,
  couchdb: CouchDBCredentials
): Client<'contabilium'> => {
  return setClient(credentials, 'contabilium', couchdb);
};
export { getQuickbooksClient, getSalesForceClient, getContabiliumClient };
