var width = 960;
var height = 960;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var rateByState = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, 5])
    .range(d3.range(30).map(function(i) {
      var opacity = (i) / 30;
      return "rgba(49, 132, 255, " + opacity + ")";
    }));

queue().
  defer(d3.json, "india.json").
  defer(d3.csv, "consumption.csv", function(d) {
    rateByState.set(d["State/UT"], +d["All.Rural"])
  }).
  await(ready);


function colorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
}

function ready(error, india) {
  if (error) return console.error(error);

  var subunits = topojson.feature(india, india.objects.states);

  var projection = d3.geo.mercator()
    .center([83, 22.5])
    .scale(1200)
    .translate([width / 2, height / 3]);

  var path = d3.geo.path()
    .projection(projection);

  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(india, india.objects.states).features)
    .enter()
    .append("path")
    .attr("style", function(d) {
      return "fill: " + quantize(rateByState.get(d.id)) + ";";
    })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(india, india.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
};
