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

  // Nesting allows elements in an array to be grouped into a hierarchical tree structure
  const nest = d3
    .nest()
    .key(d => d['Party Identifer'])
    .key(d => d['Constituency'])
    .rollup(d => d3.sum(d, d => d['Valid votes']))

  const treemap = d3
    .treemap()
    .size([width, height])
    .padding(3)
    .round(true)

  const root = d3
    .hierarchy({ values: nest.entries(data) }, function(d) {
      return d.values
    })
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root)

  return (
    <>
      {selectedCell ? (
        <div>
          <p>Current constituency: {selectedCell.constituency}</p>
          <p>
            {selectedCell.votes} votes for {selectedCell.party}
          </p>
        </div>
      ) : null}
      <svg width={width} height={height}>
        {root.leaves().map(({ x0, x1, y1, y0, parent, data, ...rest }) => {
          const party = parent.data.key
          const fill = COLOR_MAPPING[party]
          return (
            <rect
              key={`${data.key}_${data.value}`}
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
