import React from 'react';
import ReactDOM from 'react-dom';
import { d3Chart } from './d3Stuff.js'

export default class Chart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.create(el, null, this.getChartState())
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState())
  }
  getChartState() {
    return this.props.forceData
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  }
  render() {
    return (
      <div className="d3"></div>
    )
  }
}