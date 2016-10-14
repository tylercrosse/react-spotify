const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('width', 480)
      .attr('height', 480);
      
    this._drawD3(el, state);
  },
  update(el, state) {
    this._drawD3(el, state);
  },
  destroy(el) {},
  _drawD3(el, data) {
    let svg = d3.select(el).selectAll('svg')
    let width = +svg.attr('width')
    let height = +svg.attr('height')
    let nodeSize = 32
    let simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
        .id((d) => (d.id))
        .distance(nodeSize * 4)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
      
    let link = svg.append('g')
      .attr('class', 'link')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')

    let node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      
    let defs = node.append('defs')
    
    defs.append('pattern')
      .attr('id', (d) => (d.id))
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('image')
      .attr('xlink:href', (d) => (d.image.url))
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      
    node.append('circle')
      .attr('cx', nodeSize / 2)
      .attr('cy', nodeSize / 2)
      .attr('r', nodeSize / 2)
      .style('fill', (d) => (`url(#${d.id})`))

    node.append('text')
      .attr('dx', nodeSize)
      .attr('dy', (nodeSize / 2) + 4)
      .text((d) => (d.name))

    simulation
      .nodes(data.nodes)
      .on('tick', ticked);

    simulation.force('link')
      .links(data.links);

    function ticked() {
      link
        .attr('x1', (d) => (d.source.x))
        .attr('y1', (d) => (d.source.y))
        .attr('x2', (d) => (d.target.x))
        .attr('y2', (d) => (d.target.y));
        
      node
        .attr('transform', (d) => (`translate(${d.x - (nodeSize / 2)}, ${d.y - (nodeSize / 2)})`));
    }
  }
}