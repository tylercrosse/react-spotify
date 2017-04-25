import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestRelatedArtists } from '../../ducks/artist';
import { nodeMouseOver, nodeMouseOut } from '../../ducks/ui';

import ForceTree from './ForceTree.jsx';
import './viz.scss';

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

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForceTree);
