import { Subject } from 'rxjs'
import { lastOfArray } from 'rxdb/plugins/core'

import Intervention from '../models/interventionModel.js'

let lastEventId = 0
const pullStream$ = new Subject()

const pullRxdb = async (req, res) => {
  const id = req.query.id
  const updatedAt = parseInt(req.query.updatedAt, 10)
  const documents = await Intervention.find({
    $or: [
      {
        updateAt: { $gt: updatedAt }
      },
      {
        updateAt: { $eq: updatedAt },
        id: { $gt: id }
      }
    ]
  }).limit(parseInt(req.query.batchSize, 10))
  const newCheckpoint = documents.length === 0 ? { id, updatedAt } : {
    id: lastOfArray(documents).id,
    updatedAt: lastOfArray(documents).updatedAt
  };
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ documents, checkpoint: newCheckpoint }))
}

const pushRxdb = async (req, res) => {
  const changeRows = req.body
  const conflicts = []
  const event = {
    id: lastEventId++,
    documents: [],
    checkpoint: null
  }

  for(const changeRow of changeRows){
    const realMasterState = await Intervention.findOne({rxdbId: changeRow.newDocumentState.rxdbId})
    if (realMasterState && !changeRow.assumedMasterState || (realMasterState && changeRow.assumedMasterState &&
      realMasterState.updatedAt !== changeRow.assumedMasterState.updatedAt)) {
        conflicts.push(realMasterState)
    } else {
      await Intervention.findOneAndUpdate({ rxdbId: changeRow.newDocumentState.rxdbId }, changeRow.newDocumentState, { upsert: true })
      event.documents.push(changeRow.newDocumentState)
      event.checkpoint = { rxdbId: changeRow.newDocumentState.rxdbId, updatedAt: changeRow.newDocumentState.updatedAt }
    }
  }

  if (event.documents.length > 0) {
    pullStream$.next(event)
  }

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(conflicts))
}

const pullStreamRxdb = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Credentials': 'true'
  });
  const subscription = pullStream$.subscribe(event => res.write('data: ' + JSON.stringify(event) + '\n\n'))
  req.on('close', () => subscription.unsubscribe())
}

export { pullRxdb, pushRxdb, pullStreamRxdb }
