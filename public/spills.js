
var width = window.innerWidth;
var height = window.innerHeight;
var r = 4;

var spills = d3.map();

var zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

var quantize = d3.scale.quantize()
  .domain([0, .15])
  .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.albersUsa();

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(zoom);

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
// Helper Functions
// 
// toUTC converts JS Date objects to UTC
// EXAMPLE: var date = new Date('3/10/2010');
// toUTC(date); // evaluates to 1268179200000
var toUTC = function(date) {
  return Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
  );
};
// 
///////////////////////////////////////////////////////////////////

var globalData;

var redraw = function(utc) { 
  var filteredData = [];
  // console.log('globalData[0]', globalData[0]);
  console.log(globalData[0]['REPORT_RECEIVED_DATE']);
  for (var i = 0; i < globalData.length; i++) {
    var selectUtc = new Date(globalData[i]['REPORT_RECEIVED_DATE']);
    if (toUTC(selectUtc) <= utc) {
      filteredData.push(globalData[i]);
    }
  }

  toUTC(selectUtc);
  filteredData.push()
  circles.selectAll('.spills')
  .data(filteredData)
  .enter().append('svg:circle')
    .attr('class', function(d) { 
      if (d.SIGNIFICANT === 'YES') { return 'sig' + 1; }
      else { return 'sig' + 0 } })
    .attr('r', function(d) { 
      if (d.SIGNIFICANT === 'YES') { return r; }
      else { return r-1; } })
  .attr('cx', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[0]; })
  .attr('cy', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[1]; })
};

var spillData = d3.tsv("./spills.tsv", function(data) {
  globalData = data;
  // console.log('data[0]["LOCATION_LONGITUDE"]', data[0]["LOCATION_LONGITUDE"]);
  data.forEach(function(d) {
    // Function kept in case data needs to be converted before added to d
    // d.LOCATION_LONGITUDE = +d.LOCATION_LONGITUDE;
    d.UTC = +toUTC(new Date(d.REPORT_RECEIVED_DATE));
  });
});
//   circles.selectAll('.spills')
//   .data(data)
//   .enter().append('svg:circle')
//     .attr('class', function(d) { 
//       if (d.SIGNIFICANT === 'YES') { return 'sig' + 1; }
//       else { return 'sig' + 0 } })
//     .attr('r', function(d) { 
//       if (d.SIGNIFICANT === 'YES') { return r; }
//       else { return r-1; } })
//     .attr('test', function(d) {
//       // the D3 projection() function will fail silently if it gets coordinates that appear
//       // off the map - in this case, the Albers projection of the US map.
//       // This test will console log the coordinates that make projection() fail.
//       if (projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE]) === null) {
//         console.log('bad data', d.REPORT_NUMBER, d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE);
//       }})
//   .attr('cx', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[0]; })
//   .attr('cy', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[1]; })
// });

// TODO: Fix the zoom to redraw the spills
function zoomed() {
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
