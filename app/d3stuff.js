import EventEmitter from 'events';
import * as d3 from 'd3';

export const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('width', 800)
      .attr('height', 600);
      
    svg.append('g')
      .attr('class', 'links')
      
    svg.append('g')
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
    let simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => (d.id)))
      // .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
      // .force('collide',)
      // .distance(nodeSize * 4)
      // .strength(nodeSize * -4)
      
    let link = svg.select('.links')
      .selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')

    let node = svg.select('.nodes')
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
        console.log('dblclicked')
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
        .attr('x1', (d) => (d.source.x))
        .attr('y1', (d) => (d.source.y))
        .attr('x2', (d) => (d.target.x))
        .attr('y2', (d) => (d.target.y))
        
      node
        .attr('transform', (d) => (`translate(${d.x - (nodeSize / 2)}, ${d.y - (nodeSize / 2)})`))
    }
    
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      console.log('dragged')
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}

