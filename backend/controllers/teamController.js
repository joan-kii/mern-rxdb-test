import { Team } from '../models/teamModel'

const createTeam = async (req, res) => {
  const { name, numberOfTeammates } = req.body

  try {
    const team = await Team.create({
      name,
      n_teammates: numberOfTeammates
    })
    res.status(200).json(team)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export default createTeam
