## ERP connector

An internal library aimed to workalong bloom merchant and feed its interface.

## Get Started

    npm install @bloom-trade/erp-connector

```javascript
import Connector from '@bloom-trade/erp-connector';

const credentials = {
  credentials: {
    client_id: '',
    client_secret: '',
  },
  realmId: '',
  refresh_token: '',
};
const connector = new Connector();
const client = connector.getClient(credentials, 'quickbooks');
client?.getInvoice('99').then((invoices) => {
  //your invoice
  console.log(invoices.products);
});
```

### Supported ERPS ⚙️

- [Quickbooks](https://developer.intuit.com/app/developer/qbo/docs/get-started) 📚
- [Salesforce](https://www.salesforce.com/) 📚
- [Contabilium](https://contabilium.com/) 📚
