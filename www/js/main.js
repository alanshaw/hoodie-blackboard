var hoodie  = new Hoodie()
  , canvas = $("canvas")
  , ctx = canvas[0].getContext("2d")
  , drawing = false
  , from

var store = hoodie.memory.open("punk", {remote: hoodie.punk, idleTimeout: 0})

store.subscribeToOutsideEvents()
hoodie.punk.connect()

canvas.attr({
  width: $(window).width(),
  height: $(window).height()

}).hammer().on("dragstart", function (event) {

  drawing = true
  from = {x: parseInt(event.gesture.center.pageX), y: parseInt(event.gesture.center.pageY)}

}).on("dragend", function () {

  drawing = false

}).on("drag", function (event) {
  
  if(!drawing) return;
  
  var to = {x: parseInt(event.gesture.center.pageX), y: parseInt(event.gesture.center.pageY)}
  
  drawLine(ctx, from, to)

  store.add("line", {from: from, to: to})

  from = to
})

$("input").click(function () {
  store.removeAll("line")
})

function drawLine (ctx, from, to) {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.closePath()
  ctx.stroke()
}

function wipe (ctx) {
  ctx.fillRect(0, 0, canvas.width(), canvas.height())
}

ctx.strokeStyle = "#ffffff"
ctx.fillStyle = "#000000"

hoodie.reaction(function (store) {
  store.findAll("line").done(function (lines) {
    wipe(ctx)

    lines.forEach(function (line) {
      drawLine(ctx, line.from, line.to)
    })
  })
}, {store: store})

// Stop iOS from doing the bounce thing with the screen
document.ontouchmove = function (event) {
  event.preventDefault()
}