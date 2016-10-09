var fs = require('fs')
var relatedJSON = fs.readFileSync('./related.json');
var related = JSON.parse(relatedJSON)

var nodes = related.artists.map(function(val) {
  return {"id": val.id, "name": val.name}
})

var links = getLinks("4LEiUm1SRbFMgfqnQTwUbQ", related)

var forceData = {"nodes": nodes, "links": links}

function getLinks(artistId, res) {
  return res.artists.map(function(val) {
    return {"source": artistId, "target": val.id}
  })
}

// {"source": "arttistid?", "target": "artistid?"}

console.log(forceData);