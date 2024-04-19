import express from 'express'

import createTeam from '../controllers/teamController.js'

const teamRouter = express.Router()

// Create Team
teamRouter.post('/new', createTeam)

export default teamRouter
