export default {
    title: 'customers',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        name: {
            type: 'object'
        },
        email: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        billAddress: {
            type: 'string'
        }
    }
}
