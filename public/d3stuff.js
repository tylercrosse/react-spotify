const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('width', 320)
      .attr('height', 240);
      
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
    let simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => (d.id)))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
      
    let link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')

    let node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 5)

    node.append('title')
      .text((d) => (d.id));

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
        .attr('cx', (d) => (d.x))
        .attr('cy', (d) => (d.y));
    }
  }
}