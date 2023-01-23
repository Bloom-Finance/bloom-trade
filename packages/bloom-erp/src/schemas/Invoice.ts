export default {
    title: 'invoices',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        products: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    },
                    amount: {
                        type: 'number'
                    }
                }
            }
        },
        customer: {
            type: 'object',
            properties: {
                id: {
                    type: 'string'
                }
            }
        },
        email: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        createdAt: {
            type: 'number'
        },
        dueDate: {
            type: 'number'
        },
        amount: {
            type: 'number'
        }
    }
}
