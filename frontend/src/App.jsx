import { addRxPlugin } from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { useRxCollection, useRxDB, useRxQuery } from 'rxdb-hooks'

import './App.css'
import TeamForm from './components/TeamForm'
import InterventionForm from './components/InterventionForm'
import InterventionList from './components/InterventionList'

addRxPlugin(RxDBDevModePlugin)

function App() {
  const db = useRxDB()
  const teamCollection = useRxCollection('team')
  const teamQuery = teamCollection?.find({})
  
  const { result: team, isFetching } = useRxQuery(teamQuery)

  if (isFetching) 'Cargando...'

  return (
    <>
      {team.length === 0 && <TeamForm />}
      {team.length === 1 && <InterventionForm />}
      {team.length === 1 && <InterventionList />}
    </>
  )
}

export default App
