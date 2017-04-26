const helpers = (function iife() {
  return {
    fixedEncodeURIComponent,
    handleRelatedRes
  };

  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
  function handleRelatedRes(id, json, state) {
    const { forceData, search } = state.artist;

    // build nodes & links
    const newNodes = json.artists.map(val => ({
      id: val.id,
      cluster: id,
      name: val.name,
      image: val.images.pop(),
      details: val
    }));
    const newLinks = json.artists.map(val => ({
      source: id,
      target: val.id
    }));

    // no old data
    if (Object.keys(forceData).length === 0) {
      // grab the artist object that was clicked on in search results
      const source = search.results.find(obj => obj.id === id);

      // add it in with the other nodes
      newNodes.push({
        id: source.id,
        cluster: source.id,
        name: source.name,
        image: source.images.pop(),
        details: source
      });

      // return -> forceData
      return {
        nodes: newNodes,
        links: newLinks
      };
    }
    // yes old data, key the old nodes by id
    const allNodes = forceData.nodes
      .reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});

    // don't add duplicates
    for (const node of newNodes) {
      allNodes[node.id] = allNodes[node.id] || node;
    }
    // build links, & key them by source:target
    const allLinks = forceData.links
      .map(n => ({
        source: n.source.id,
        target: n.target.id
      }))
      .reduce((acc, link) => {
        acc[link.source + ':' + link.target] = link;
        return acc;
      }, {});

    // cross refrence links to build web
    for (const link of newLinks) {
      const key = `${link.source}:${link.target}`;
      allLinks[key] = allLinks[key] || link;
    }

    // return -> forceData
    return {
      nodes: _values(allNodes).map(_Node),
      links: _values(allLinks).map(_Link)
    };
  }
  // normalize output
  function _Node({ id, cluster, name, image, details }) {
    return { id, cluster, name, image, details };
  }
  function _Link({ source, target }) {
    return { source, target };
  }
  // remove weird keys
  function _values(object) {
    return Object.keys(object).map(key => object[key]);
  }
}());
export default helpers;
