var settings = {
  w: window.innerWidth,
  h: window.innerHeight,
  r: 5
};

var mouse = { x: settings.w/2, y: settings.h/2 };
var pixelize = function(number){ return number + 'px'; }

///////////////////////////////////////////////////////////////////

var mapBoard = d3.select('.mapBoard').style({
  width: pixelize( settings.w ),
  height: pixelize( settings.h )
});

d3.select('.mouse').style({
  top: pixelize( mouse.y ),
  left: pixelize( mouse.x ),
  width: pixelize( settings.r*2 ),
  height: pixelize( settings.r*2 ),
  'border-radius': pixelize( settings.r*2 )
});

var spills = mapBoard.selectAll('.spills')
  .data(d3.range(settings.n))
  .enter().append('div')
  .attr('class', 'spill')
  .style({
    // top: randY,
    // left: randX,
    width: pixelize( settings.r*2 ),
    height: pixelize( settings.r*2 )
  });

mapBoard.on('mousemove', function(){
  var loc = d3.mouse(this);
  mouse = { x: loc[0], y: loc[1] };
  d3.select('.mouse').style({
    top: pixelize( mouse.y-settings.r ),
    left: pixelize( mouse.x-settings.r )
  })
});
