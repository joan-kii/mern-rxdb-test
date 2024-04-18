import express from 'express'

import { createTeam } from '../controllers/teamController'

const teamRouter = express.Router()

// Create Team
teamRouter.post('/new', createTeam)

export default teamRouter
