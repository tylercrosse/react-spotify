import React from 'react'

export default class NodeDetails extends React.Component {
  componentWillMount() {
    // console.log('🍕', this.props.hoveredNode)
  }
  render() {
    let hn = this.props.hoveredNode;
    return (
      <div className='node-details'>
        <img src={hn.details.images[0].url} />
        <span>{hn.name}</span>
      </div>
    )
  }
} 