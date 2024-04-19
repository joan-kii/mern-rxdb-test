import express from 'express'

import { pullRxdb, pushRxdb, pullStreamRxdb } from '../controllers/rxdbController.js'

const rxdbRouter = express.Router()

// Pull RxDB
rxdbRouter.get('/pull', pullRxdb)

// Push RxDB
rxdbRouter.get('/pull', pushRxdb)

// Pull Stream RxDB
rxdbRouter.get('/pullStream', pullStreamRxdb)

export default rxdbRouter
