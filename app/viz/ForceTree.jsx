import React    from 'react';
import ReactDOM from 'react-dom';
import { d3ForceTree } from '../utils/d3forceTree.js'

export default class ForceTree extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    d3ForceTree.create(el, null, this.getForceTreeState(), this.props.actions)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.forceData !== nextProps.forceData) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3ForceTree.update(el, this.getForceTreeState(), this.props.actions)
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3ForceTree.destroy(el);
  }
  getForceTreeState() {
    return this.props.forceData;
  }
  render() {
    return (
      <div className="d3"></div>
    )
  }
}