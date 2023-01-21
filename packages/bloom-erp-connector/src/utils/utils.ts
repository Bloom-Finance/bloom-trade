import moment from 'moment';
import { Pagination, Sort } from '../@types';
import OAuthClient = require('intuit-oauth');
/**
 * It returns true if the date is after the reference date, and false if it's not
 * @param {string} date - The date to be checked
 * @param {string} reference_date - The date to compare against.
 * @returns A boolean
 */
const isDateExpired = (date: string, reference_date: string) => {
  const isAfter = moment(date).isAfter(reference_date, 'days') as boolean;
  return isAfter;
};

const applySQLFilters = (pagination?: Pagination, sort?: Sort) => {
  let sql = '';
  if (sort && sort.fieldName && sort.order) {
    sql += `%20ORDERBY%20${sort.fieldName}%20${sort.order.toUpperCase()}`;
  }
  if (pagination && pagination?.limit && pagination.offset) {
    sql += `%20LIMIT%20${pagination.limit ? pagination.limit : 10}%20OFFSET%20${
      pagination.offset ? pagination.offset : 0
    }`;
  }
  return sql;
};

const logInToQuickbooks = (
  client: {
    client_id: string;
    client_secret: string;
  },
  env: 'sandbox' | 'production',
  redirectUri: string,
  logging = false
) => {
  const authClient = new OAuthClient({
    clientId: client.client_id,
    clientSecret: client.client_secret,
    redirectUri: redirectUri,
    logging,
    environment: env,
  });
  const url = authClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'intuit-test' as any,
  });
  return url;
};

export { isDateExpired, applySQLFilters, logInToQuickbooks };
