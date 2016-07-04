$(window).load(function(){
  
Hammer.plugins.showTouches();
Hammer.plugins.fakeMultitouch();

$("#pan").css({
  transform: "translate3d(0, 0, 0) " +
             "scale3d(1, 1, 1) ",
  transformOrigin: "left top"
});
  
var $pinch = $("#pan");
var pinch = $pinch[0];
var currentZoom, startX, startY, originX, originY, scale, deltaX, deltaY;
var zoom = 1;
var panX = 0;
var panY = 0;

Hammer(pinch)
.on('transformstart', function (event) {
        currentZoom = zoom;
        startX = event.gesture.center.pageX;
        startY = event.gesture.center.pageY;
        originX = startX/currentZoom;
        originY = startY/currentZoom;
        $pinch.css({
          transformOrigin: originX+"px "+originY+"px"
        });
})
.on('transform', function (event) {
        scale = Math.max(0.25/currentZoom, Math.min(event.gesture.scale, 6/currentZoom));
        deltaX = (event.gesture.center.pageX - startX) / currentZoom;
        deltaY = (event.gesture.center.pageY - startY) / currentZoom;
        $pinch.css({
          transform: "translate3d("+deltaX+"px,"+deltaY+"px, 0) " +
                     "scale3d("+scale+","+scale+", 1) "
        });
})
.on('transformend', function (event) {

  zoom = currentZoom * scale;
  zoom = Math.max(0.25, Math.min(zoom, 6));
  $pinch.css({

    transform: "translate3d(0, 0, 0) " +
               "scale3d(1, 1, 1) ",
    zoom: zoom
  });
})
.on('dragstart', function(event){
})
.on('drag', function(event){
  $pinch.css({
    transform: "translate3d("+event.gesture.deltaX/zoom+"px, "+event.gesture.deltaY/zoom+"px, 0) "
  });
})
.on('dragend', function(event){
  console.log(event);
  $pinch.css({

    transform: "translate3d(0, 0, 0) "
  });

  panX += event.gesture.deltaX/zoom;
  panY += event.gesture.deltaY/zoom;
  $("#content").css({
    left: panX,
    top: panY
  });
})
  
  
  
});