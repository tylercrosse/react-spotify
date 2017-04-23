import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import ForceTree    from './ForceTree.jsx';
import                   './viz.scss';

function mapStateToProps(state) {
  return {
    forceData: state.forceData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForceTree);
