import { useState } from 'react'

function TeamForm() {
  const [teamName, setTeamName] = useState('')
  const [numberOfTeammates, setNumberOfTeammates] = useState(0)
  const [team, setTeam] = useState({})

  const handleClick = (e) => {
    e.preventDefault()
    setTeam({teamName, numberOfTeammates})
    console.log(team);
    setTeamName('')
    setNumberOfTeammates(0)
  }

  return (
    <form>
      <label>
        Nombre del equipo:
        <input
          name="team-name"
          value={teamName}
          onChange={({ target }) => { setTeamName(target.value) }}
        />
      </label>
      <label>
        Numero de miembros:
        <input
          name="number-teammates"
          value={numberOfTeammates}
          onChange={({ target }) => { setNumberOfTeammates(target.value) }}
        />
      </label>
      <button onClick={handleClick}>Crear Equipo</button>
    </form>
  )
}

export default TeamForm
