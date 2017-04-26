import React       from 'react';
import { connect } from 'react-redux';

function NodeDetails({ hoveredNode }) {
  const hn = hoveredNode;
  const top = ((window.innerHeight / 2) > hn.clientY) ?
    hn.clientY - 108 :
    hn.clientY + 22;
  const detailsPos = {
    top,
    left: hn.clientX - 140
  };
  const bg = {
    background: `url(${hn.details.images[0].url}) 50% 50% no-repeat`,
    backgroundSize: 'cover'
  };
  return (
    <div className="node-details" style={detailsPos}>
      <div className="node-det-img-ctnr" style={bg}>
        {/* <img src={hn.details.images[0].url} /> */}
      </div>
      <div className="node-det-caption">
        <h3>{hn.name}</h3>
        <p>{hn.details.followers.total} followers</p>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    hoveredNode: state.ui.hoveredNode
  };
}

export default connect(
  mapStateToProps,
  null
)(NodeDetails);
