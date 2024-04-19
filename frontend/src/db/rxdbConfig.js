import { createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateRxCollection } from 'rxdb/plugins/replication'
import { Subject } from 'rxjs'

import teamSchema from '../models/teamModel'
import interventionSchema from '../models/interventionModel'

export const initialize = async () => {
  const db = await createRxDatabase({
    name: 'group-rxdb',
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
  
  const pullStream$ = new Subject()
  
  const eventSource = new EventSource(`${import.meta.env.VITE_SERVER}/db/pullStream`, { withCredentials: true })
  eventSource.onmessage = event => {
    const eventData = JSON.parse(event.data)
    pullStream$.next({
      documents: eventData.documents,
      checkpoint: eventData.checkpoint
    })
  }
  
  eventSource.onerror = () => pullStream$.next('RESYNC')
  
  const replicationState = replicateRxCollection({
    collection: dbCollection.interventions,
    replicationIdentifier: 'http-team-replication',
    push: {
      async handler(changeRows) {
        const rawResponse = await fetch(`${import.meta.env.VITE_SERVER}/db/push`, {
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
        const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : 0
        const id = checkpointOrNull ? checkpointOrNull.id : ''
        const response = await fetch(`${import.meta.env.VITE_SERVER}/db/pull?updatedAt=${updatedAt}&id=${id}&limit=${batchSize}`)
        const data = await response.json()
        return {
          documents: data.documents,
          checkpoint: data.checkpoint
        }
      },
      stream$: pullStream$.asObservable()
    }
  })
  
  return db
}
