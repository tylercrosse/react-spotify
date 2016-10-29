import React from 'react';
import ReactDOM from 'react-dom';
import { d3ForceTree } from '../utils/d3stuff.js'
import NodeDetails from './NodeDetails'
import './viz.scss'

export default class ForceTree extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let dispatcher = d3ForceTree.create(el, null, this.getForceTreeState())
    
    dispatcher.on('node:dblclick', this.nodeDblClick.bind(this));
    dispatcher.on('node:mouseover', this.nodeMouseover.bind(this));
    dispatcher.on('node:mouseout', this.nodeMouseout.bind(this));
    this.dispatcher = dispatcher
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceData !== nextProps.forceData) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3ForceTree.update(el, this.getForceTreeState(), this.dispatcher)
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3ForceTree.destroy(el);
  }
  getForceTreeState() {
    return this.props.forceData
  }
  nodeDblClick(d) {
    this.props.d3dblclick({clickedNode: d});
  }
  nodeMouseover(d) {
    this.props.d3mouseover(d)
  }
  nodeMouseout(d) {
    this.props.d3mouseout(d)
  }
  render() {
    return (
      <div className="d3"></div>
    )
  }
}