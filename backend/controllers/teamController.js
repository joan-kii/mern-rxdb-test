import Team from '../models/teamModel.js'

const createTeam = async (req, res) => {
  const { teamName, numberOfTeammates } = req.body
  try {
    const team = await Team.create({
      name: teamName,
      n_teammates: numberOfTeammates
    })
    res.status(200).json(team)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export default createTeam
