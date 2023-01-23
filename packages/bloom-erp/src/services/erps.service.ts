/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ERPs,
  Filters,
  Invoice,
  erpCredentials,
  Customer,
  Pagination,
  Sort,
} from '../@types';
const getInvoices = async <T extends ERPs>(
  credentials: { erpType: T; erpCredentials: erpCredentials<T> },
  filters?: Filters,
  pagination?: Pagination,
  sort?: Sort
): Promise<Invoice[]> => {
  const { ERPConnectorImpl } = require(`../impl/${credentials.erpType}/index`);
  const service = new ERPConnectorImpl(credentials.erpCredentials);
  const invoices = await service.getInvoices(filters, pagination, sort);
  return invoices as Invoice[];
};
const getInvoice = async <T extends ERPs>(
  credentials: {
    erpType: T;
    erpCredentials: erpCredentials<T>;
  },
  id: string
): Promise<Invoice> => {
  const { ERPConnectorImpl } = require(`../impl/${credentials.erpType}/index`);
  const service = new ERPConnectorImpl(credentials.erpCredentials);
  const myInvoice = await service.getInvoice(id);
  return myInvoice as Invoice;
};
const getCustomers = async <T extends ERPs>(
  credentials: {
    erpType: T;
    erpCredentials: erpCredentials<T>;
  },
  pagination?: Pagination,
  sort?: Sort
): Promise<Customer[]> => {
  const { ERPConnectorImpl } = require(`../impl/${credentials.erpType}/index`);
  const service = new ERPConnectorImpl(credentials.erpCredentials);
  const customers = await service.getCustomers(pagination, sort);
  return customers as Customer[];
};
const getCustomer = async <T extends ERPs>(
  credentials: {
    erpType: T;
    erpCredentials: erpCredentials<T>;
  },
  id: string
): Promise<Customer> => {
  const { ERPConnectorImpl } = require(`../impl/${credentials.erpType}/index`);
  const service = new ERPConnectorImpl(credentials.erpCredentials);
  const customer = await service.getCustomer(id);
  return customer as Customer;
};
export { getInvoices, getInvoice, getCustomers, getCustomer };
