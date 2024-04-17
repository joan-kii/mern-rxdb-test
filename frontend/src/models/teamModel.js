const teamSchema = {
  version: 0,
  title: 'team schema',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    n_teammates: {
      type: 'number'
    },
    interventions: {
      type: 'array',
      uniqueItems: true,
      items: {
        interventionId: {
          type: 'string'
        }
      }
    }
  },
  required: [
    'id',
    'name',
    'n_teammates',
    'interventions'
  ]
}

export default teamSchema
