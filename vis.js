var width = 960,
height = 960;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

queue().
  defer(d3.json, "india.json").
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

  svg.append("path")
    .datum(subunits)
    .attr("d", path);

  svg.selectAll(".subunit")
    .data(topojson.feature(india, india.objects.states).features)
    .enter().append("path")
    .attr("class", function(d) { return "subunit " + d.id; })
    .attr("d", path);
};
