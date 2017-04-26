import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestRelatedArtists } from '../../ducks/artist';
import { nodeMouseOver, nodeMouseOut } from '../../ducks/ui';
import d3ForceTree from '../../utils/d3forceTree';
import './viz.scss';

class ForceTree extends React.Component {
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
    return <div className="d3" />;
  }
}

const Actions = {
  requestRelatedArtists,
  nodeMouseOver,
  nodeMouseOut
};

function mapStateToProps(state) {
  return {
    forceData: state.artist.forceData
  };
}

// TODO clean up actions?
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForceTree);
