export default {
    title: 'updatedAt',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        updatedAt: {
            type: 'number'
        }
    }
}
