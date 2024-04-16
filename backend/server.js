import { MongoClient } from 'mongodb'
import express from 'express'
import 'dotenv/config'
import { lastOfArray } from 'rxdb/plugins/core'
import { Subject } from 'rxjs'

const mongoClient = new MongoClient(process.env.MONGO_CLIENT)
const mongoConnection = await mongoClient.connect(process.env.MONGO_URI)
const mongoDatabase = mongoConnection.db('mern-rxdb-test')
const teamsCollection = mongoDatabase.collection('teams')

// express app
const app = express()

// middleware
app.use(express.json())

let lastEventId = 0
const pullStream$ = new Subject()

// routes
app.get('/pull', async (req, res) => {
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
})

// seguir aquí
app.get('/push', (req, res) => {
  const changeRows = req.body;
  const conflicts = [];
  const event = {
      id: lastEventId++,
      documents: [],
      checkpoint: null
  };
  for(const changeRow of changeRows){
      const realMasterState = mongoCollection.findOne({id: changeRow.newDocumentState.id});
      if(
          realMasterState && !changeRow.assumedMasterState ||
          (
              realMasterState && changeRow.assumedMasterState &&
              /*
               * For simplicity we detect conflicts on the server by only compare the updateAt value.
               * In reality you might want to do a more complex check or do a deep-equal comparison.
               */
              realMasterState.updatedAt !== changeRow.assumedMasterState.updatedAt
          )
      ) {
          // we have a conflict
          conflicts.push(realMasterState);
      } else {
          // no conflict -> write the document
          mongoCollection.updateOne(
              {id: changeRow.newDocumentState.id},
              changeRow.newDocumentState
          );
          event.documents.push(changeRow.newDocumentState);
          event.checkpoint = { id: changeRow.newDocumentState.id, updatedAt: changeRow.newDocumentState.updatedAt };
      }
  }
  if(event.documents.length > 0){
      myPullStream$.next(event);
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(conflicts));
});

// running app
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
