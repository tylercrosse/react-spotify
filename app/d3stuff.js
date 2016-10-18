import * as d3 from 'd3';
import EventEmitter from 'eventemitter3';

export const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('width', 800)
      .attr('height', 600);
    let g = svg.append('g')
    
    g.append('g')
      .attr('class', 'links')
      
    g.append('g')
      .attr('class', 'nodes')
      
    let dispatcher = new EventEmitter();
    this._drawForceLay(el, state, dispatcher);
    
    return dispatcher;
  },
  update(el, state, dispatcher) {
    this._drawForceLay(el, state, dispatcher);
  },
  destroy(el) {},
  _drawForceLay(el, data, dispatcher) {
    let svg = d3.select(el).selectAll('svg')
    let width = +svg.attr('width')
    let height = +svg.attr('height')
    let nodeSize = 16
    let transform = d3.zoomIdentity
    let simulation = d3.forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody()
        .strength(-100)
      )
      .force('link', d3.forceLink(data.links)
        .id((d) => (d.id))
        .distance(20)
        .strength(1)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      
    svg
      .call(d3.zoom()
        .scaleExtent([1 / 2, 8])
        .on("zoom", zoomed)
      )
      .on('dblclick.zoom', null)
    
    let g = svg.select('g')
      
    let link = g.select('.links')
      .selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')

    let node = g.select('.nodes')
      .selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .on('dblclick', (d) => {
        console.log('dblclicked', d)
        dispatcher.emit('node:dblclick', d)
      })
      
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
      
    node.exit()
      .remove()
      
    link.exit()
      .remove()

    function ticked() {
      link
        .attr('x1', (d) => (d.source.x + (width / 2)))
        .attr('y1', (d) => (d.source.y + (height / 2)))
        .attr('x2', (d) => (d.target.x + (width / 2)))
        .attr('y2', (d) => (d.target.y + (height / 2)))
        
      node
        .attr('transform', (d) => (`translate(${d.x - (nodeSize / 2) + (width / 2)}, ${d.y - (nodeSize / 2) + (height / 2)})`))
    }
    function zoomed() {
      g.attr('transform', d3.event.transform);
    }
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      console.log('dragged', d)
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = null;
      d.fy = null;
    }
  }
}
