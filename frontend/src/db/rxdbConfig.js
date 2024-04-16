import { createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateRxCollection } from 'rxdb/plugins/replication'

import { teamSchema } from '../models/teamModel'
import { interventionSchema } from '../models/interventionModel'

const db = await createRxDatabase({
  name: 'team',
  storage: getRxStorageDexie(),
  eventReduce: true
})

const dbCollection = await db.addCollections({
  team: {
    schema: teamSchema
  },
  interventions: {
    schema: interventionSchema
  }
})

const replicationState = replicateRxCollection({
  collection: dbCollection,
  replicationIdentifier: 'http-team-replication',
  push: {
    async handler(changeRows) {
      const rawResponse = await fetch(`${import.meta.env.VITE_SERVER}/push`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(changeRows)
      })
      const conflictsArray = await rawResponse.json()
      return conflictsArray
    }
  },
  pull: {
    async handler(checkpointOrNull, batchSize) {
      const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : 0;
      const id = checkpointOrNull ? checkpointOrNull.id : '';
      const response = await fetch(`${import.meta.env.VITE_SERVER}/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`);
      const data = await response.json();
      return {
        documents: data.documents,
        checkpoint: data.checkpoint
      };
    }  
  }
})

console.log(replicationState)
