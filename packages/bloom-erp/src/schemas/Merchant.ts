export default {
  title: 'merchants',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    quickbooks: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
        },
        credentials: {
          type: 'object',
          properties: {
            client_id: {
              type: 'string',
            },
            client_secret: {
              type: 'string',
            },
          },
        },
        refresh_token: {
          type: 'string',
        },
        access_token: {
          type: 'string',
        },
        realm_id: {
          type: 'string',
        },
      },
    },
    name: {
      type: 'string',
    },
  },
};
