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

var spillData = d3.csv("./spills.csv", function(d) {
  return {
    report_number: +d.report_number,
    significant: !!d.significant,
    location_latitude: +d.location_latitude,
    location_longitude: +d.location_longitude
  };
}, function(error, data) {
  if (error) {
    console.log('error', error);
  } else { 
    dataset = data;
    console.log(dataset);
  }
});

d3.select('body')
  .selectAll('p')
  .data(dataset)
  .append('p')
  .text(function(d){return d.report_number;});
//   .d3.selectAll('spills')
//   .append("circle")
//   .attr("r", r)
//   .attr("transform", function(d) {
//     return "translate(" + projection([d.location_longitude, d.location_latitude]) + ")";
//   });
