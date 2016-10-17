import EventEmitter from 'events';
import * as d3 from 'd3';

export const d3Chart = {
  create(el, props, state) {
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
      .on('tick', ticked)
      
    let canvas = document.querySelector('canvas')
    let context = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height
    let transform = d3.zoomIdentity;
    
    d3.select(canvas)
      .call(d3.drag()
        .container(canvas)
        .subject(mousesubject)
        .on('start',dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
      .call(d3.zoom().scaleExtent([1 / 2, 8]).on('zoom', zoomed))
      .on('dblclick.zoom', null)
      .on('dblclick', (d) => {
        console.log('dblclick', mousesubject())
        dispatcher.emit('node:dblclick', mousesubject()) 
      })
      .call(ticked);

    function ticked() {
      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(width / 2, height / 2)
      context.scale(transform.k, transform.k);
      
      context.beginPath()
      data.links.forEach(drawLink)
      context.strokeStyle = '#0003ff'
      context.stroke()
      
      context.beginPath()
      data.nodes.forEach(drawNode)

      context.restore()
    }
    function mousesubject() {
      let subj = simulation.find(d3.event.x - width / 2, d3.event.y - height / 2)
      return subj
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
    function zoomed() {
      transform = d3.event.transform;
      ticked();
    }
    function drawLink(d) {
      context.moveTo(d.source.x, d.source. y)
      context.lineTo(d.target.x, d.target. y)
    }
    function drawNode(d) {
      let imgObj = new Image()
      imgObj.src = d.image.url
      context.save()
      context.beginPath()
      context.arc(d.x, d.y, 8, 0, 2 * Math.PI)
      context.moveTo(d.x + 8, d.y)
      context.closePath()
      context.clip()
      context.moveTo(d.x + 8, d.y)
      context.drawImage(imgObj, d.x - 8, d.y - 8, 16, 16)
      context.strokeStyle = '#fff'
      context.stroke()
      context.restore()
    }

    // 
    // node.append('text')
    //   .attr('dx', nodeSize)
    //   .attr('dy', (nodeSize / 2) + 4)
    //   .text((d) => (d.name))

  }
}

