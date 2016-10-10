var fs = require('fs');
var jsonfile = require('jsonfile');
var relatedJSON = fs.readFileSync('./related.json');
var related = JSON.parse(relatedJSON)

var nodes = related.artists.map(function(val) {
  return {"id": val.id, "name": val.name, "image": val.images.pop()}
})

var links = getLinks("4LEiUm1SRbFMgfqnQTwUbQ", related)

var forceData = {"nodes": nodes, "links": links}

function getLinks(artistId, res) {
  return res.artists.map(function(val) {
    return {"source": artistId, "target": val.id}
  })
}

// {"source": "arttistid?", "target": "artistid?"}

jsonfile.writeFile('r.json', forceData, 'utf8')