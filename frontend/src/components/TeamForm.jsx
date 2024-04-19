import { useState } from 'react'
import { useRxCollection } from 'rxdb-hooks'

function TeamForm() {
  const [teamName, setTeamName] = useState('')
  const [numberOfTeammates, setNumberOfTeammates] = useState(0)
  const collection = useRxCollection('team')

  const handleClick = async (e) => {
    e.preventDefault()
    const url = `${import.meta.env.VITE_SERVER}/team/new`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ teamName, numberOfTeammates })
    })
    const team = await response.json()
    await collection.insert({ ...team, id: team._id })
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
