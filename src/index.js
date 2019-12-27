import * as d3 from 'd3'

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

d3.csv(require('./Results-Table 1.csv')).then(function(data) {
  // ONS Code,PANO,Constituency,Surname,First name,Party,Party Identifer,Valid votes
  //   Nesting allows elements in an array to be grouped into a hierarchical tree structure
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
  console.log('treemap(root):', treemap(root))

  const rootNode = d3
    .select('#treemap')
    .selectAll('.node')
    .data(root.leaves())
    .enter()
    .append('div')
    .attr('class', 'node')
    .style('left', function(d) {
      return d.x0 + 'px'
    })
    .style('top', function(d) {
      return d.y0 + 'px'
    })
    .style('width', function(d) {
      return d.x1 - d.x0 + 'px'
    })
    .style('height', function(d) {
      return d.y1 - d.y0 + 'px'
    })
    .style('background', function(d) {
      const party = d.parent.data.key
      return COLOR_MAPPING[party]
    })

  rootNode
    .append('div')
    .attr('class', 'node-label')
    .text(function(d) {
      return d.data.key
    })

  rootNode
    .append('div')
    .attr('class', 'node-value')
    .text(function(d) {
      return d.data.value
    })
})
