import { Subject } from 'rxjs'
import { lastOfArray } from 'rxdb/plugins/core'

let lastEventId = 0
const pullStream$ = new Subject()

const pullRxdb = async (req, res) => {
  const id = req.query.id
  const updatedAt = parseInt(req.query.updatedAt, 10)
  const documents = await teamsCollection.find({
    $or: [
      {
        updateAt: { $gt: updatedAt }
      },
      {
        updateAt: { $eq: updatedAt },
        id: { $gt: id }
      }
    ]
  }).limit(parseInt(req.query.batchSize, 10)).toArray()
  const newCheckpoint = documents.length === 0 ? { id, updatedAt } : {
    id: lastOfArray(documents).id,
    updatedAt: lastOfArray(documents).updatedAt
  };
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ documents, checkpoint: newCheckpoint }))
}

const pushRxdb = (req, res) => {
  const changeRows = req.body
  const conflicts = []
  const event = {
    id: lastEventId++,
    documents: [],
    checkpoint: null
  }

  for(const changeRow of changeRows){
    const realMasterState = teamsCollection.findOne({id: changeRow.newDocumentState.id});
    if (realMasterState && !changeRow.assumedMasterState || (realMasterState && changeRow.assumedMasterState &&
      realMasterState.updatedAt !== changeRow.assumedMasterState.updatedAt)) {
        conflicts.push(realMasterState)
    } else {
      teamsCollection.updateOne({ id: changeRow.newDocumentState.id }, changeRow.newDocumentState)
      event.documents.push(changeRow.newDocumentState)
      event.checkpoint = { id: changeRow.newDocumentState.id, updatedAt: changeRow.newDocumentState.updatedAt }
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
    'Cache-Control': 'no-cache'
  });
  const subscription = pullStream$.subscribe(event => res.write('data: ' + JSON.stringify(event) + '\n\n'))
  req.on('close', () => subscription.unsubscribe())
}

export { pullRxdb, pushRxdb, pullStreamRxdb }
