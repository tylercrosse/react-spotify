export const helpers = (function(){
  return {
    getHashParams: getHashParams,
    fixedEncodeURIComponent: fixedEncodeURIComponent,
    handleRelatedRes: handleRelatedRes
  }
  
  function getHashParams() {
    let hashParams = {};
    let e;
    let r = /([^&;=]+)=?([^&;]*)/g
    let q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams
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
      image: val.images.pop()
    }));
    let newLinks = json.artists.map(val => ({
      source: id,
      target: val.id
    }));

    if (!state.forceData) {
      // no old data
      let source = state.artistRes.find(obj => obj.id === id);

      newNodes.push({
        id: source.id,
        cluster: source.id,
        name: source.name,
        image: source.images.pop()
      });
      return {
        nodes: newNodes,
        links: newLinks
      };
    } 
    else {
      const allNodes = state.forceData.nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      for (let node of newNodes) {
        allNodes[node.id] = allNodes[node.id] || node;
      }
      const allLinks = state.forceData.links
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
        nodes: values(allNodes).map(Node),
        links: values(allLinks).map(Link)
      };
    }
    function Node({ id, cluster, name, image }) {
      return { id, cluster, name, image };
    }
    function Link({ source, target }) {
      return { source, target }; 
    }
    function values(object) {
      return Object.keys(object).map(key => object[key]);
    }
  }
})()