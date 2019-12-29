import * as d3 from 'd3'
import PubSub from './Pubsub'
import Pubsub from './Pubsub'

const currentConstituencyTracker = new Pubsub()

const width = document.querySelector('#treemap').getBoundingClientRect().width
const height = 900
const COLOR_MAPPING = {
  Conservative: '#0087DC',
  Labour: '#DC241f',
  SNP: '#FDF38E',
  'Liberal Democrats': '#FAA61A',
  'Plaid Cymru': '#008142',
  'Green Party': '#6AB023'
}

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

let currentConstituency = null

d3.csv(require('./Results-Table 1.csv')).then(function(data) {
  // ONS Code,PANO,Constituency,Surname,First name,Party,Party Identifer,Valid votes

  const root = d3
    .hierarchy({ values: nest.entries(data) }, function(d) {
      return d.values
    })
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root)

  const rootNode = d3
    .select('#treemap')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')

  rootNode
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return d.x0
    })
    .attr('y', function(d) {
      return d.y0
    })
    .attr('width', function(d) {
      return d.x1 - d.x0
    })
    .attr('height', function(d) {
      return d.y1 - d.y0
    })
    .style('stroke', 'black')
    .style('fill', function(d) {
      const party = d.parent.data.key
      return COLOR_MAPPING[party]
    })
    .on('mouseover', function(d) {
      let currentConstituency = d.data.key
      currentConstituencyTracker.trigger(
        'SET_CURRENT_CONSTITUENCY',
        currentConstituency
      )
    })
    .on('mouseout', function(d) {
      currentConstituencyTracker.trigger('SET_CURRENT_CONSTITUENCY', null)
    })
})

currentConstituencyTracker.on(
  'SET_CURRENT_CONSTITUENCY',
  currentConstituency => {
    document.querySelector(
      '#currentConstituency'
    ).innerHTML = currentConstituency
  }
)
