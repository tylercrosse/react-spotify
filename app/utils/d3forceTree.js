import * as d3 from 'd3';
// TODO trim import, just using select, force, drag, zoom 

export const d3ForceTree = (function() {
  let svg, slider, g, link, node, defs
  let zoom, width, height, simulation
  let nodeSize = 16
  let transform = d3.zoomIdentity
  
  return {
    create: create,
    update: update,
    destroy: destroy
  }
  
  function create(el, props, state, actions) {
    simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody()
        .strength(-200)
      )
      .force('link', d3.forceLink()
        .id((d) => (d.id))
        .distance(20)
        .strength(1)
      )
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      
    zoom = d3.zoom()
      .scaleExtent([1 / 2, 4])
      .on('zoom', _zoomed)
      
    slider = d3.select(el).append('input')
      .datum({})
      .attr('type', 'range')
      .attr('value', zoom.scaleExtent()[0])
      .attr('min', zoom.scaleExtent()[0])
      .attr('max', zoom.scaleExtent()[1])
      .attr('step', (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
      .on('input', _slided);
      
    svg = d3.select(el).append('svg')   
      .call(zoom)
      .on('dblclick.zoom', null)
      
    g = svg.append('g')
    
    g.append('g')
      .attr('class', 'links')
      
    g.append('g')
      .attr('class', 'nodes')
      
    _resize();
    d3.select(window).on('resize', _resize);
      
    _drawForceLay(el, state, actions);
  }
  function update(el, state, actions) {
    simulation.nodes([]);
    simulation.force('link').links([]);

    g.selectAll('.node').remove();
    g.selectAll('.link').remove();
    
    _drawForceLay(el, state, actions);
  }
  function destroy(el) {}
  function _drawForceLay(el, data, actions) {
    _drawLinks(data)
    _drawNodes(data, actions)

    simulation
      .nodes(data.nodes)
      .on('tick', _ticked);

    simulation.force('link')
      .links(data.links);
  }
  function _drawLinks(data) {
    link = g.select('.links')
      .selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
  }
  function _drawNodes(data, actions) {
    node = g.select('.nodes')
      .selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', _dragstarted)
        .on('drag', _dragged)
        .on('end', _dragended)
      )
      .on('dblclick', (d) => {
        actions.d3dblclick(d);
      })
      .on('mouseover', function(d) {
        actions.d3mouseover(d);
      })
      .on('mouseout', function(d) {
        actions.d3mouseout(d);
      });
    
    defs = node.append('defs')
    
    defs.append('pattern')
      .attr('id', (d) => (d.id))
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('image')
      .attr('xlink:href', (d) => (d.image.url))
      .each(_makeRound)

    node.append('circle')
      .attr('cx', nodeSize / 2)
      .attr('cy', nodeSize / 2)
      .attr('r', nodeSize / 2)
      .style('fill', (d) => (`url(#${d.id})`))
  }
  function _ticked() {
    link
      .attr('x1', (d) => (d.source.x + (width / 2)))
      .attr('y1', (d) => (d.source.y + (height / 2)))
      .attr('x2', (d) => (d.target.x + (width / 2)))
      .attr('y2', (d) => (d.target.y + (height / 2)))
      
    node
      .attr('transform', (d) => (`translate(${d.x - (nodeSize / 2) + (width / 2)}, ${d.y - (nodeSize / 2) + (height / 2)})`))
  }
  function _zoomed() {
    g.attr('transform', d3.event.transform);
    slider.property('value',  d3.event.transform.k);
  }
  function _slided(d) {
    zoom.scaleTo(g, d3.select(this).property('value'))
  }
  function _dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function _dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function _dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0.0).restart();
    d.fx = null;
    d.fy = null;
  }
  function _makeRound(selection) {
    let w = 0;
    let h = 0;
    let dx = 0;
    let dy = 0;
    
    d3.select(this)
      .attr('width', (d) => {
        w = d.image.width
        h = d.image.height
        dx = Math.max(nodeSize, nodeSize * (w/h) )
        return dx
      })
      .attr('height', (d) => {
        dy = Math.max(nodeSize, nodeSize * (h/w) )
        return dy
      })
      .attr('x', (d) => ( -(dx - nodeSize)/2 ))
      .attr('y', (d) => ( -(dy - nodeSize)/2 ))
  }
  function _resize() {
    let navHeight = 52;
    width = window.innerWidth
    height = window.innerHeight - navHeight;
    svg.attr('width', width).attr('height', height);
  }
})();
