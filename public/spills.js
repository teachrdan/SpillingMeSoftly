var circles;
var projection;

var resize = function() {
  // Calculate the height of the content div, minus the heights of the header and footer.
  var contentHeight = $('#container').outerHeight(true) - $('#header').outerHeight(true) - $('#footer').outerHeight(true);
  $('#content').height(contentHeight);
  $('#map').html('');
  drawMap();
};


var drawMap = function() {

  var height = $('#content').height() - $('#sliderContainer').outerHeight(true);
  var width = height * 1.6;

  var spills = d3.map();

  var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

  projection = d3.geo.albersUsa()
    .scale(height * 2) // Not sure why I have to augment the height, either.
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = svg.append("g");

  circles = svg.append("svg:g")
    .attr("id", "circles");

  ///////////////////////////////////////////////////////////////////

  d3.json("./us.json", function(error, us) {
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path);

  g.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("id", "state-borders")
    .attr("d", path);
  });
};

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

var spillData = d3.tsv("./spills.tsv", function(data) {
  globalData = data;
  data.forEach(function(d) {
    d.UTC = +toUTC(new Date(d.REPORT_RECEIVED_DATE));
  });
});

var redraw = function(utc) { 
  
  var key = function(d) {
    return d.REPORT_NUMBER;
  };

  var r = 5;
  var filteredData = [];

  for (var i = 0; i < globalData.length; i++) {
    if (globalData[i].UTC <= utc) {
      filteredData.push(globalData[i]);
    }
  }
  var spills = circles.selectAll('.spills')
  .data(filteredData, key)

  circles.selectAll('circle').remove();

  spills.enter().append('svg:circle')
    .attr('class', function(d) {
      if (d.SIGNIFICANT === 'YES') { return 'sig' + 1; }
      else { return 'sig' + 0 } })
    .attr('r', function(d) {
      if (d.SIGNIFICANT === 'YES') { return r; }
      else { return r - 1; } })
    .attr('test', function(d) {
      // The D3 projection() function will fail silently if it gets coordinates that appear
      // off the map - in this case, the Albers projection of the US map.
      // This test will console log the coordinates that make projection() fail.
      if (projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE]) === null) {
        console.log('bad data', d.REPORT_NUMBER, d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE);
      }
    })
    .attr('cx', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[0]; })
    .attr('cy', function(d) { return projection([d.LOCATION_LONGITUDE, d.LOCATION_LATITUDE])[1]; });

  spills.exit().transition().remove();
};

var initSlider = function() {
  $("#slider").slider({
    value: 2014,
    min: 1268179200000, //UTC of the first report_received_date in TSV, '3/10/2010'
    max: 1409097600000, //UTC of the last report_received_date in TSV, '8/27/2014'
    step: 6,
    slide: function(event, ui) {
      // console.log('event', event);
      // console.log('ui', ui);
      var temp = new Date(ui.value);
      var m_names = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
      var month = m_names[temp.getMonth()];
      // Add + 1 to day to compensate for UTC vs. US time zones.
      var displayDate = '' + month + ' ' + (temp.getDate() + 1) + ', ' + temp.getFullYear();
      $("#date").html(displayDate);
      // console.log(ui.value);
      redraw(ui.value);
    }
  });
};
// var$("#date").val($("#slider").slider("value"));

// Initialization function
$(function(){
  initSlider();
  $(window).on('resize', resize);
  resize();
});
