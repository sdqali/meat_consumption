var width = 960;
var height = 960;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var rateByState = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, 4.983])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

queue().
  defer(d3.json, "india.json").
  defer(d3.csv, "consumption.csv", function(d) {
    rateByState.set(d["State/UT"], +d["All.Rural"])
  }).
  await(ready);


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
    .attr("class", function(d) {
      return quantize(rateByState.get(d.id));
    })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(india, india.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
};
