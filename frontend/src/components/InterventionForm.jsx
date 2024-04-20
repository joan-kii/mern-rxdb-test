import { useState } from 'react'
import { useRxCollection } from 'rxdb-hooks'
import { v4 as uuidv4 } from 'uuid'

function InterventionForm() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const collection = useRxCollection('interventions')

  const handleClick = async (e) => {
    e.preventDefault()
    await collection.insert({ rxdbId: uuidv4(), title, text })
    setTitle('')
    setText('')
  }

  return (
    <form>
      <label>
        Descripción:
        <input
          name="title"
          value={title}
          onChange={({ target }) => { setTitle(target.value) }}
        />
      </label>
      <label>
        Intervención:
        <input
          name="text"
          value={text}
          onChange={({ target }) => { setText(target.value) }}
        />
      </label>
      <button onClick={handleClick}>Crear Intervención</button>
    </form>
  )
}

export default InterventionForm
