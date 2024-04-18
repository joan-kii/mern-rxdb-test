import { useState } from 'react'
import { useRxCollection } from 'rxdb-hooks'

function TeamForm() {
  const [teamName, setTeamName] = useState('')
  const [numberOfTeammates, setNumberOfTeammates] = useState(0)
  const collection = useRxCollection('characters')

  const handleClick = async (e) => {
    e.preventDefault()
    // seguir aquí
    /* await collection.insert({}) */
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
