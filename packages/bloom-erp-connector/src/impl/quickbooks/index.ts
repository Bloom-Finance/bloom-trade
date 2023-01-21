/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Customer,
  Filters,
  Invoice,
  Pagination,
  Sort,
  IERPConnector,
  Quickbooks,
} from '../../@types';
import { ERPConnector } from '../credentials';
import { erpCredentials, Products } from '../../@types';
import axios from 'axios';
import moment from 'moment';
import { applySQLFilters, isDateExpired } from '../../utils/utils';
export class ERPConnectorImpl extends ERPConnector implements IERPConnector {
  private quickbooksCreds = this._credentials as erpCredentials<'quickbooks'>;
  private _url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.quickbooksCreds.realmId}`;
  async getCustomer(id: string): Promise<Customer> {
    try {
      const { data } = (await axios.get(
        `${this._url}/customer/${id}?minorversion=40`,
        {
          headers: {
            Authorization: `Bearer ${this.quickbooksCreds.access_token}`,
          },
        }
      )) as {
        data: { Customer: Quickbooks.customer };
      };
      const myCustomer: Customer = {
        id,
        email: data.Customer.PrimaryEmailAddr
          ? data.Customer.PrimaryEmailAddr.Address
          : undefined,
        name: data.Customer.DisplayName,
        phone: data.Customer.PrimaryPhone
          ? data.Customer.PrimaryPhone.FreeFormNumber
          : undefined,
        billAddress: data.Customer.BillAddr
          ? data.Customer.BillAddr.Line1
          : null,
        type: 'customer',
      };
      return myCustomer;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async getInvoices(
    filters?: Filters | undefined,
    pagination?: Pagination | undefined,
    sort?: Sort | undefined
  ): Promise<Invoice[]> {
    try {
      const { data } = (await axios.get(
        `${this._url}/query?query=SELECT%20*FROM%20Invoice${applySQLFilters(
          pagination,
          sort
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.quickbooksCreds.access_token}`,
          },
        }
      )) as {
        data: { QueryResponse: { Invoice: Quickbooks.Invoice[] } };
      };
      let myInvoices: Invoice[] = [];
      data.QueryResponse.Invoice.forEach((v) => {
        const myProducts: Products[] = [];
        v.Line.forEach((line) => {
          myProducts.push({
            id: line.Id,
            description: line.Description,
            amount: line.Amount,
            type: 'invoice',
          });
        });
        const isOverdue = isDateExpired(
          moment(new Date()).toDate().toISOString(),
          v.DueDate
        );
        const isPaid = v.Balance === 0 ? true : false;
        myInvoices.push({
          id: v.Id,
          products: myProducts,
          email: v.BillEmail ? v.BillEmail.address : undefined,
          customer: {
            id: v.CustomerRef.value,
          },
          status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'unpaid',
          createdAt: moment(v.MetaData.CreateTime).toDate().getTime(),
          dueDate: moment(v.DueDate, 'YYYY-MM-DD').toDate().getTime(),
          amount: v.TotalAmt,
          type: 'invoice',
        });
      });
      if (filters) {
        myInvoices = myInvoices
          .filter((invoice) =>
            filters.status && filters.status !== 'all'
              ? invoice.status === filters.status
              : invoice
          )
          .filter((invoice) =>
            filters.fromDate
              ? moment(invoice.createdAt).isSameOrAfter(filters.fromDate)
              : invoice
          )
          .filter((invoice) =>
            filters.toDate
              ? moment(invoice.createdAt).isSameOrBefore(filters.toDate)
              : invoice
          );
      }
      return myInvoices as Invoice[];
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async getInvoice(id: string): Promise<Invoice> {
    try {
      const { data } = (await axios.get(`${this._url}/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${this.quickbooksCreds.access_token}`,
        },
      })) as {
        data: { Invoice: Quickbooks.Invoice };
      };
      const myProducts: Products[] = [];
      data.Invoice.Line.forEach((line) => {
        myProducts.push({
          id: line.Id,
          description: line.Description,
          amount: line.Amount,
          type: 'invoice',
        });
      });
      const isOverdue = isDateExpired(
        moment(new Date()).toDate().toISOString(),
        data.Invoice.DueDate
      );
      const isPaid = data.Invoice.Balance === 0 ? true : false;
      const myInvoice: Invoice = {
        id,
        products: myProducts,
        email: data.Invoice.BillEmail.address,
        customer: {
          id: data.Invoice.CustomerRef.value,
        },
        status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'unpaid',
        createdAt: moment(data.Invoice.MetaData.CreateTime).toDate().getTime(),
        dueDate: moment(data.Invoice.DueDate, 'YYYY-MM-DD').toDate().getTime(),
        amount: data.Invoice.TotalAmt,
        type: 'invoice',
      };
      return myInvoice;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async getCustomers(
    pagination?: Pagination | undefined,
    sort?: Sort | undefined
  ): Promise<Customer[]> {
    const { data } = (await axios.get(
      `${this._url}/query?query=SELECT%20*FROM%20Customer${applySQLFilters(
        pagination,
        sort
      )}`,
      {
        headers: {
          Authorization: `Bearer ${this.quickbooksCreds.access_token}`,
        },
      }
    )) as {
      data: { QueryResponse: { Customer: Quickbooks.customer[] } };
    };
    const myCustomers: Customer[] = [];
    data.QueryResponse.Customer.forEach((v) => {
      myCustomers.push({
        id: v.Id,
        email: v.PrimaryEmailAddr ? v.PrimaryEmailAddr.Address : undefined,
        name: v.DisplayName,
        phone: v.PrimaryPhone ? v.PrimaryPhone.FreeFormNumber : undefined,
        billAddress: v.BillAddr ? v.BillAddr.Line1 : null,
        type: 'invoice',
      });
    });
    return myCustomers;
  }
  // async logIn() {}
  // async getCredentials() {}
}
