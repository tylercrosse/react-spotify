import EventEmitter from 'events';
import * as d3 from 'd3';

export const d3Chart = {
  create(el, props, state) {
    // let svg = d3.select(el).append('svg')
    //   .attr('width', 800)
    //   .attr('height', 600);
    //   
    // svg.append('g')
    //   .attr('class', 'links')
    //   
    // svg.append('g')
    //   .attr('class', 'nodes')
      
    let dispatcher = new EventEmitter();
    this._drawForceLay(el, state, dispatcher);
    
    return dispatcher;
  },
  update(el, state, dispatcher) {
    this._drawForceLay(el, state, dispatcher);
  },
  destroy(el) {},
  _drawForceLay(el, data, dispatcher) {
    let nodeSize = 32
    let simulation = d3.forceSimulation(data.nodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink(data.links)
        .id((d) => (d.id))
        .distance(80)
        .strength(4)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .on('tick', ticked)
      
    let canvas = document.querySelector('canvas')
    let context = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height
    
    d3.select(canvas)
      .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on('start',dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
    
    function ticked() {
      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(width / 2, height / 2)
      
      context.beginPath()
      data.links.forEach(drawLink)
      context.strokeStyle = '#0003ff'
      context.stroke()
      
      context.beginPath()
      data.nodes.forEach(drawNode)
      context.fill()
      context.strokeStyle = '#fff'
      context.stroke()
      
      context.restore()
    }
    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2)
    }
    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }
    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }
    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }
    function drawLink(d) {
      context.moveTo(d.source.x, d.source. y)
      context.lineTo(d.target.x, d.target. y)
    }
    function drawNode(d) {
      context.moveTo(d.x + 12, d.y)
      context.arc(d.x, d.y, 12, 0, 2 * Math.PI)
    }
    
    // let link = svg.select('.links')
    //   .selectAll('.link')
    //   .data(data.links)
    //   .enter().append('line')
    //   .attr('class', 'link')
    // 
    // let node = svg.select('.nodes')
    //   .selectAll('.node')
    //   .data(data.nodes)
    //   .enter().append('g')
    //   .attr('class', 'node')
    //   .call(d3.drag()
    //     .on('start', dragstarted)
    //     .on('drag', dragged)
    //     .on('end', dragended)
    //   )
    //   .on('dblclick', (d) => { dispatcher.emit('node:dblclick', d) })
    //   
    // let defs = node.append('defs')
    // 
    // defs.append('pattern')
    //   .attr('id', (d) => (d.id))
    //   .attr('width', nodeSize)
    //   .attr('height', nodeSize)
    //   .attr('patternUnits', 'userSpaceOnUse')
    //   .append('image')
    //   .attr('xlink:href', (d) => (d.image.url))
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', nodeSize)
    //   .attr('height', nodeSize)
    //   
    // node.append('circle')
    //   .attr('cx', nodeSize / 2)
    //   .attr('cy', nodeSize / 2)
    //   .attr('r', nodeSize / 2)
    //   .style('fill', (d) => (`url(#${d.id})`))
    // 
    // node.append('text')
    //   .attr('dx', nodeSize)
    //   .attr('dy', (nodeSize / 2) + 4)
    //   .text((d) => (d.name))
    // 
    // simulation
    //   .nodes(data.nodes)
    //   .on('tick', ticked);
    // 
    // simulation.force('link')
    //   .links(data.links);
    //   
    // node.exit()
    //   .remove()
    //   
    // link.exit()
    //   .remove()
    // 
    // function ticked() {
    //   link
    //     .attr('x1', (d) => (d.source.x))
    //     .attr('y1', (d) => (d.source.y))
    //     .attr('x2', (d) => (d.target.x))
    //     .attr('y2', (d) => (d.target.y))
    //     
    //   node
    //     .attr('transform', (d) => (`translate(${d.x - (nodeSize / 2)}, ${d.y - (nodeSize / 2)})`))
    // }
    // 
    // function dragstarted(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    //   d.fx = d.x;
    //   d.fy = d.y;
    // }
    // 
    // function dragged(d) {
    //   d.fx = d3.event.x;
    //   d.fy = d3.event.y;
    // }
    // 
    // function dragended(d) {
    //   if (!d3.event.active) simulation.alphaTarget(0);
    //   d.fx = null;
    //   d.fy = null;
    // }
  }
}

