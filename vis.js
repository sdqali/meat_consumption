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
  defer(d3.json, "india.json")
  .defer(d3.csv, "consumption.csv", function(d) {
    rateByState.set(d.id, d)
  })
  .await(ready);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


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
      return "fill: " + quantize(rateByState.get(d.id)["All.Rural"]) + ";";
    })
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip
	.html(toolTipHtml(d.id))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(india, india.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
};

function toolTipHtml(id) {
  var state = rateByState.get(id);
  return id +
    "<br/>" +
    state["All.Rural"] + " kg/month";
}
