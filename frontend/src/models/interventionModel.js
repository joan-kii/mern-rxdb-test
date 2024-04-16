const interventionSchema = {
  keyCompression: true,
  version: 0,
  title: 'intervention schema',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    title: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  },
  required: [
    id,
    title,
    text
  ]
}

export default interventionSchema
