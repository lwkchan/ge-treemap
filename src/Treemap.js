import React, { useState } from 'react'
import * as d3 from 'd3'

const COLOR_MAPPING = {
  Conservative: '#0087DC',
  Labour: '#DC241f',
  SNP: '#FDF38E',
  'Liberal Democrats': '#FAA61A',
  'Plaid Cymru': '#008142',
  'Green Party': '#6AB023'
}

const Treemap = props => {
  const { width, height, data } = props
  const [selectedCell, setSelectedCell] = useState(null)
  const [selectedView, setSelectedView] = useState('byParty')

  // Nesting allows elements in an array to be grouped into a hierarchical tree structure
  const nest =
    selectedView === 'byParty'
      ? d3
          .nest()
          .key(d => d['Party Identifer'])
          .key(d => d['Constituency'])
          .rollup(d => d3.sum(d, d => d['Valid votes']))
      : selectedView === 'byConstituency'
      ? d3
          .nest()
          .key(d => d['Constituency'])
          .key(d => d['Party Identifer'])
          .rollup(d => d3.sum(d, d => d['Valid votes']))
      : null

  const treemap = d3
    .treemap()
    .size([width, height])
    .padding(3)
    .paddingOuter(0)
    .round(true)

  const root = d3
    .hierarchy({ values: nest.entries(data) }, function(d) {
      return d.values
    })
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root)
  console.log(root.leaves())

  return (
    <>
      <div style={{ height: '200px' }}>
        <label htmlFor="byParty">By Party</label>
        <input
          type="radio"
          id="byParty"
          name="byParty"
          checked={selectedView === 'byParty'}
          onChange={e => {
            setSelectedView(e.target.name)
          }}
        />
        <label htmlFor="byConstituency">By Constituency</label>
        <input
          type="radio"
          id="byConstituency"
          name="byConstituency"
          checked={selectedView === 'byConstituency'}
          onChange={e => {
            setSelectedView(e.target.name)
          }}
        />
        {selectedCell ? (
          <>
            <p>Current constituency: {selectedCell.constituency}</p>
            <p>
              {selectedCell.votes} votes for {selectedCell.party}
            </p>
          </>
        ) : null}
      </div>
      <svg width={width} height={height}>
        {root.leaves().map(({ x0, x1, y1, y0, parent, data, ...rest }) => {
          const party = parent.data.key
          const fill = COLOR_MAPPING[party]
          return (
            <rect
              key={`${data.key}_${data.value}_${parent.data.key}`}
              x={x0}
              y={y0}
              width={x1 - x0}
              height={y1 - y0}
              fill={fill}
              onMouseOver={() => {
                setSelectedCell({
                  constituency: data.key,
                  votes: data.value,
                  party
                })
              }}
              onMouseOut={() => {
                setSelectedCell(null)
              }}
            />
          )
        })}
      </svg>
    </>
  )
}

export default Treemap
