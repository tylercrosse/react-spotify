import React from 'react';
import ForceTree   from './ForceTree.jsx'
import NodeDetails from './NodeDetails.jsx'
import                  './viz.scss'

export default class VizContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredNode: null
    }
  }
  nodeMouseover(d) {
    this.setState({hoveredNode: d})
  }
  nodeMouseout(d) {
    this.setState({hoveredNode: null})
  }
  wonkyd3dblclick(partialState, cb) {
    // TODO replace with event dispatcher or something better
    this.props.d3dblclick(partialState, cb)
  }
  renderNodeDetails() {
    if (this.state.hoveredNode !== null) {
      return (
        <NodeDetails hoveredNode={this.state.hoveredNode}/>
      )
    }
  }
  render() {
    return (
      <div>
        {this.renderNodeDetails()}
        <ForceTree 
          forceData={this.props.forceData} 
          d3dblclick={(partialState, cb) => this.wonkyd3dblclick(partialState, cb)} 
          d3
          d3mouseover={(d) => this.nodeMouseover(d)}
          d3mouseout={(d) => this.nodeMouseout(d)}
        /> 
      </div>
    )
  }
}