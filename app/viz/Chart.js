import React from 'react';
import ReactDOM from 'react-dom';
import { d3Chart } from '../utils/d3stuff.js'
import './viz.scss'


export default class Chart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let dispatcher = d3Chart.create(el, null, this.getChartState())
    
    dispatcher.on('node:dblclick', this.nodeDblClick.bind(this));
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
    d3Chart.update(el, this.getChartState(), this.dispatcher)
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  }
  getChartState() {
    return this.props.forceData
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