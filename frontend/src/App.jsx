import { addRxPlugin } from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { useRxCollection, useRxDB } from 'rxdb-hooks'

import './App.css'
import TeamForm from './components/TeamForm'
import InterventionForm from './components/InterventionForm'

addRxPlugin(RxDBDevModePlugin)

function App() {
  const db = useRxDB()
  const teamCollection = useRxCollection('team')
  console.log(teamCollection)
  // seguir aquí
  
  /* const teamExist = teamCollection.find()
  console.log(teamExist) */

  return (
    <>
      {!teamCollection && <TeamForm />}
      {teamCollection && <InterventionForm />}
    </>
  )
}

export default App
