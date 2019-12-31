import * as d3 from 'd3'
import React, { useEffect, useState } from 'react'
import Treemap from './Treemap'

const App = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    d3.csv(require('./Results-Table 1.csv')).then(data => {
      setData(data)
    })
  }, [])

  return (
    <div className="container">
      <h1>UK 2015 General Election Treemap</h1>
      {data ? <Treemap data={data} width={1200} height={1200} /> : null}
    </div>
  )
}

export default App
