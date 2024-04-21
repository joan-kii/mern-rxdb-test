import { useRxCollection, useRxQuery } from 'rxdb-hooks'

import Intervention from './Intervention'

function InterventionList() {
  const interventionsCollection = useRxCollection('interventions')

  /* if (interventionsCollection) {
    interventionsCollection.$.subscribe((event) => console.log(event))
  } */

  const query = interventionsCollection?.find({})
  const { result: interventionsList, isFetching } = useRxQuery(query)

  if (isFetching) (<p>Nothing to show</p>)

  return (
    <div>
      {interventionsList && interventionsList.map((intervention) => {
        return (
          <Intervention key={intervention.rxdbId} intervention={intervention} />
        )
      })}
    </div>
  )
}

export default InterventionList
