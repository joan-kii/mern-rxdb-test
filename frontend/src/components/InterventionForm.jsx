import { useState } from 'react'

function InterventionForm() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [intervention, setIntervention] = useState({})

  const handleClick = (e) => {
    e.preventDefault()
    setIntervention({ title, text })
    console.log(intervention)
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
