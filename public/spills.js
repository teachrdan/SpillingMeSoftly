var width = window.innerWidth;
var height = window.innerHeight;
var r = 5;

var spills = d3.map();

var quantize = d3.scale.quantize()
  .domain([0, .15])
  .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.albersUsa();

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

var circles = svg.append("svg:g")
  .attr("id", "circles");

///////////////////////////////////////////////////////////////////

d3.json("./us.json", function(error, us) {
  g.append("g")
    .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .on("click", clicked);

g.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path);
});

///////////////////////////////////////////////////////////////////

var spillData = d3.csv("./spills2.csv")
  .row(function(d) {
    return {
      report_num: +d.report_num,
      significant: +d.significant,
      long: +d.long,
      lat: +d.lat
    };
  })
  .get(function callback(error, rows) {
    console.log('rows', rows[0]);
    circles.selectAll('.spills')
      .data(rows)
      .enter().append('svg:circle')
        .attr('class', function(d) { return 'sig' + d.significant; })
        .attr('r', r)
        .attr('cx', function(d) { return projection([d.long, d.lat])[0]; })
        .attr('cy', function(d) { return projection([d.long, d.lat])[1]; })
  });
