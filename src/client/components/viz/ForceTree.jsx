import React       from 'react';
import ReactDOM    from 'react-dom';
import d3ForceTree from '../../utils/d3forceTree';

export default class ForceTree extends React.Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    d3ForceTree.create(el, null, this.getForceTreeState(), this.props.actions);
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.forceData !== nextProps.forceData) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    const el = ReactDOM.findDOMNode(this);
    d3ForceTree.update(el, this.getForceTreeState(), this.props.actions);
  }
  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    d3ForceTree.destroy(el);
  }
  getForceTreeState() {
    return this.props.forceData;
  }
  render() {
    return (
      <div className="d3" />
    );
  }
}
