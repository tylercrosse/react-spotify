export const helpers = (function(){
  return {
    fixedEncodeURIComponent: fixedEncodeURIComponent,
    handleRelatedRes: handleRelatedRes
  }
  
  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  function handleRelatedRes(id, json, state) {
    let newNodes = json.artists.map(val => ({
      id: val.id,
      cluster: id,
      name: val.name,
      image: val.images.pop(),
      details: val
    }));
    let newLinks = json.artists.map(val => ({
      source: id,
      target: val.id
    }));

    if (Object.keys(state.forceData).length == 0) {
      // no old data
      let source = state.search.results.find(obj => obj.id === id);

      newNodes.push({
        id: source.id,
        cluster: source.id,
        name: source.name,
        image: source.images.pop(),
        details: source
      });
      return {
        nodes: newNodes,
        links: newLinks
      };
    } 
    else {
      const allNodes = state.forceData.forceData.nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      for (let node of newNodes) {
        allNodes[node.id] = allNodes[node.id] || node;
      }
      const allLinks = state.forceData.forceData.links
        .map(n => ({
          source: n.source.id,
          target: n.target.id
        }))
        .reduce((acc, link) => {
          acc[link.source + ':' + link.target] = link;
          return acc;
        }, {});
        
      for (let link of newLinks) {
        const key = `${link.source}:${link.target}`;
        allLinks[key] = allLinks[key] || link;
      }
      return {
        nodes: _values(allNodes).map(_Node),
        links: _values(allLinks).map(_Link)
      };
    }
  }
  function _Node({ id, cluster, name, image, details }) {
    return { id, cluster, name, image, details };
  }
  function _Link({ source, target }) {
    return { source, target }; 
  }
  function _values(object) {
    return Object.keys(object).map(key => object[key]);
  }
})()