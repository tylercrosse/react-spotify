import React from 'react';
import ReactDOM from 'react-dom';
import { d3Chart } from '../utils/d3stuff.js'

export default class Chart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let dispatcher = d3Chart.create(el, null, this.getChartState())
    
    dispatcher.on('node:dblclick', this.nodeDblClick.bind(this));
    this.dispatcher = dispatcher
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState(), this.dispatcher)
  }
  getChartState() {
    return this.props.forceData
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  }
  nodeDblClick(d) {
    this.props.d3related({activeNode: d});
  }
  render() {
    return (
      <div className="d3"></div>
    )
  }
}