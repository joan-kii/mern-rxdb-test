const interventionSchema = {
  version: 0,
  title: 'intervention schema',
  primaryKey: 'rxdbId',
  type: 'object',
  properties: {
    rxdbId: {
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
    'rxdbId',
    'title',
    'text'
  ]
}

export default interventionSchema
