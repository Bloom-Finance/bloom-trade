/* eslint-disable @typescript-eslint/no-namespace */

import nano from 'nano';

/**Connector and client interface**/
export interface IConnector {
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
  >;
  authenticate(apiCredentials: any, erp: ERPs): void; // Solo hace la autenticacion y guarda en el indexDB los datos para luego conectarse
  setQuickbooksCredentials(
    credentials: erpCredentials<'quickbooks'>
  ): Promise<nano.DocumentInsertResponse>;
  getCredentials<T extends ERPs>(erp: T): Promise<erpCredentials<T>>; // Toma del indexDB las credenciales del Merchant que luego es necceario para. el connect
  isAuthenticated(): boolean; // Determina si esta autenticado el merchant
}

export interface IERPConnector {
  getInvoices(
    filters?: Filters,
    pagination?: Pagination,
    sort?: Sort
  ): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice>;
  getCustomers(pagination?: Pagination, sort?: Sort): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer>;
}
export interface Client<A extends ERPs> {
  erpType: A;
  erpCredentials: erpCredentials<A>;
  couchDB: {
    credentials: CouchDBCredentials;
    insertDocs(docs: Invoice[] | Customer[]): Promise<void>;
    updateCredentials(
      id: string,
      erpType: ERPs,
      erpCredentials: erpCredentials<ERPs>
    ): Promise<nano.DocumentInsertResponse>;
  };
  getInvoices(
    filters?: Filters,
    pagination?: Pagination,
    sort?: Sort
  ): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice>;
  getCustomers(pagination?: Pagination, sort?: Sort): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer>;
}
export interface CouchDBDocs {
  _id?: string;
  _rev?: string;
  type: 'invoice' | 'customer' | 'updatedAt' | 'merchant';
}
export interface CouchDBCredentials {
  user: string;
  password: string;
  database: string;
}
/**ERPs  related objects**/
export type erpCredentials<T extends ERPs> = T extends 'quickbooks'
  ? Quickbooks.client
  : T extends 'salesforce'
  ? SalesForce.client
  : Contabilium.client;
export interface Invoice extends CouchDBDocs {
  id: string;
  products: Products[];
  customer: {
    id: string;
  };
  email?: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'draft';
  createdAt: number;
  dueDate: number;
  amount: number;
}
export type ERPs = 'salesforce' | 'quickbooks' | 'contabilium';
export type Currencies = 'ARS' | 'USD' | 'EUR' | 'ars' | 'usd' | 'eur';
export interface Filters {
  status: 'paid' | 'unpaid' | 'overdue' | 'draft' | 'all';
  fromDate?: number;
  toDate?: number;
}
export interface Pagination {
  offset?: number;
  limit?: number;
}
export interface Sort {
  fieldName: string;
  order: 'asc' | 'desc';
}
export interface Products extends CouchDBDocs {
  id?: string;
  description?: string;
  amount: number;
}
export interface Customer extends CouchDBDocs {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  billAddress: string | null;
}
/**ERPs namespaces**/
export namespace Quickbooks {
  export interface error {
    response: {
      data: {
        Fault: {
          type: 'ValidationFault' | 'other';
          Error: {
            Message: string;
            Detail: string;
            code: string;
            element: string;
          };
        };
        time: string;
      };
    };
  }
  export interface client {
    credentials: {
      client_id: string;
      client_secret: string;
    };
    realmId: string;
    refresh_token: string;
    access_token: string;
  }
  export interface products {
    Description: string;
    DetailType: string;
    LineNum: number;
    Amount: number;
    Id: string;
    SalesItemLineDetail: {
      TaxCodeRef: {
        value: string;
      };
      Qty: number;
      UnitPrice: number;
      ServiceDate: string;
      ItemRef: {
        name: string;
        value: string;
      };
    };
  }
  export interface Invoice {
    Id: string;
    TxnDate: string;
    domain: string;
    CurrencyRef: {
      name: string;
      value: string;
    };
    ShipDate: string;
    TrackingNum: string;
    ClassRef: {
      name: string;
      value: string;
    };
    PrintStatus: string;
    SalesTermRef: {
      value: string;
    };
    DeliveryInfo: {
      DeliveryType: string;
      DeliveryTime: string;
    };
    TotalAmt: number;
    Line: Quickbooks.products[];
    CustomerRef: {
      value: string;
    };
    BillEmail: {
      address: string;
    };
    EmailStatus: string;
    DueDate: string;
    Balance: number;
    MetaData: {
      CreateTime: string;
    };
  }
  export interface customer {
    PrimaryEmailAddr: {
      Address: string;
    };
    GivenName: string;
    DisplayName: string;
    CompanyName: string;
    PrimaryPhone: {
      FreeFormNumber: string;
    };
    BillAddr: {
      Line1: string;
    };
    Id: string;
  }
}
export namespace SalesForce {
  export interface client {
    credentials: {
      test: string;
    };
  }
  export interface products {
    billEmail?: string;
  }
  export interface customer {
    phone?: string;
  }
}
export namespace Contabilium {
  export interface client {
    credentials: {
      test: string;
    };
  }
  export interface products {
    billEmail?: string;
  }
  export interface customer {
    phone?: string;
  }
}
