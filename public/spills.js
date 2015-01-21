var width = window.innerWidth;
var height = window.innerHeight;
var r = 4;

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

g.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path);
});

///////////////////////////////////////////////////////////////////
// FOR TESTING PURPOSES
// function testGPS(coordinates) {
//   var x = coordinates[0], y = coordinates[1];
//   point = null;
//   (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
//   return point;
// }

// .attr('test', function(d) { if (testGPS([d.long, d.lat]) === null) {
//   console.log('the error is', data);
// }
// });

///////////////////////////////////////////////////////////////////

var spillData = d3.csv("./spills3.csv")
  .row(function(d) {
    return {
      report_num: +d.report_num,
      report_received: d.report_received,
      co_name: d.co_name,
      significant: d.significant,
      lat: +d.lat,
      long: +d.long
    };
  })
  .get(function callback(error, rows) {
    console.log('rows[0]', rows[0]);
    circles.selectAll('.spills')
      .data(rows)
      .enter().append('svg:circle')
        .attr('class', function(d) { if (d.significant === 'true') { return 'sig' + 1; }
          else { return 'sig' + 0 }
        })
        .attr('r', function(d) { 
          if (d.significant === 'true') {
          return r;
        } else {
          return r-1;
        }
        })
        .attr('test', function(d) {
          if (projection([d.long, d.lat]) === null) {
            console.log('bad data', d);
          }
        })
    .attr('cx', function(d) { return projection([d.long, d.lat])[0]; })
    .attr('cy', function(d) { return projection([d.long, d.lat])[1]; })
    .append("svg:title")
    .text(function(d) { return d.co_name; })
});
