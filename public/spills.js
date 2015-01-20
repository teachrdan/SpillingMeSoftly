var width = window.innerWidth;
var height = window.innerHeight;
var r = 5;
var dataset;

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

var circles = svg.append("svg:g")
  .attr("id", "circles");

var mouse = { x: width/2, y: height/2 };
var pixelize = function(number){ return number + 'px'; }

///////////////////////////////////////////////////////////////////

// var mapBoard = d3.select('.mapBoard').style({
//   width: pixelize( width ),
//   height: pixelize( height )
// });

// d3.select('.mouse').style({
//   top: pixelize( mouse.y ),
//   left: pixelize( mouse.x ),
//   width: pixelize( r*2 ),
//   height: pixelize( r*2 ),
//   'border-radius': pixelize( r*2 )
// });

// var spills = mapBoard.selectAll('.spills')
//   .data(d3.range(settings.n))
//   .enter().append('div')
//   .attr('class', 'spill')
//   .style({
//     width: pixelize( r*2 ),
//     height: pixelize( r*2 )
//   });

var spillData = d3.csv("./spills.csv")
  .row(function(d) {
    return {
      report_num: +d.report_num,
      significant: +d.significant,
      lat: +d.lat,
      long: +d.long
    };
  })
  .get(function callback(error, rows) {
    console.log('rows', rows[0]);
    circles.selectAll('.spills')
      .data(rows)
      .enter().append('svg:circle')
        // .attr('class', 'spills')
        // .append('svg:circle')
        // .attr('class', 'symbol')
        .attr('class', function(d) { return 'sig' + d.significant; })
        .attr('cx', function(d) { return projection([d.long, d.lat])[0]; })
        .attr('cy', function(d) { return projection([d.long, d.lat])[1]; })
        .attr('r', r)
  });
