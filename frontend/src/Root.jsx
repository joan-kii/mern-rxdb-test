import { useState, useEffect } from 'react'
import { Provider } from 'rxdb-hooks'
import { initialize } from './db/rxdbConfig'
import App from './App'

const Root = () => {
  const [db, setDb] = useState()

  useEffect(() => {
    initialize().then(setDb)
  }, [])

  return (
    <Provider db={db}>
      <App />
    </Provider>
  )
}

export default Root
