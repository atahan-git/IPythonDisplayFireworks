
////////////
// CLASSES
////////////
function Hex(position, targetRadius, color) {
  var subs = 3;

  this.radius = targetRadius;
  this.sides = randomIndex([4, 6, 8, 10, 12]);
  this.targetHex = new Path.RegularPolygon(position, this.sides, targetRadius);
  this.paths = [];

  for (var i = 0; i < subs; i++) {
	  var h = new Path.RegularPolygon(position, this.sides, 0);

	  if (i === 0) {
		  h.strokeColor = color;
	  }
	  else {
		  h.strokeColor = new Color({
			  hue:color.hue,
			  saturation:color.saturation,
			  lightness:randomRange(0.4, 0.6),
			  alpha:1
		  });
	  }

	  h.strokeWidth = 24;
	  h.shadowBlur = 64;
	  h.shadowColor = h.strokeColor;

	  this.paths.push(h);
  }

  this.color = this.paths[subs - 1].strokeColor;

  this.speed = 125*5;
}
Hex.prototype = {
  animate:function() {
	  var tl = new TimelineMax({
		  onComplete:function() {
			  this.paths.forEach(function(p) {
				  p.remove();
			  });
		  },
		  onCompleteScope:this
	  });

	  var duration = this.radius / this.speed,
		  offset = 0,
		  ease = Cubic.easeOut;

	  this.paths.forEach(function(h) {
		  var from, to;

		  for (var i = 0; i < h.segments.length; i++) {
			  from = h.segments[i].point;
			  to = this.targetHex.segments[i].point;

			  tl.to(from, duration, {x:to.x, y:to.y, ease:ease}, offset);
			  tl.to(h, duration, {strokeWidth:0, ease:ease}, offset);
		  }

		  offset += 0.2;

	  }, this);

	  return tl;
  }
};

function Line(start, angle, length, color) {
  this.start = start;
  this.end = new Point();

  this.end.setAngle(angle);
  this.end.setLength(length);
  this.end += this.start;

  this.path = new Path();
  this.path.add(this.start, this.end);
  this.color = this.path.strokeColor = color;
  this.path.visible = false;
  this.path.strokeWidth = 2;
  this.path.strokeCap = 'round';
  this.path.shadowBlur = 32;
  this.path.shadowColor = this.color;

  this.speed = 250*5;
}
Line.prototype = {
  animate:function() {
	  var tl = new TimelineMax({
		  onStart:function() {
			  this.path.visible = true;
		  },
		  onStartScope:this,
		  onComplete:function() {
			  this.path.remove();
		  },
		  onCompleteScope:this
	  });

	  var start = this.path.segments[0].point,
		  end = this.path.segments[1].point;

	  var duration = this.path.length / this.speed,
		  ease = Cubic;

	  tl.from(end, duration, {x:start.x, y:start.y, ease:ease.easeInOut});
	  tl.to(start, duration * 0.75, {x:end.x, y:end.y, ease:ease.easeOut}, '-=0.5');

	  return tl;
  }
};

function createFirework() {
  var tl = new TimelineMax();

  var startPoint = new Point((view.size.width*0.2) +(view.size.width*0.6 * Math.random()), view.size.height),
	  angle = 270,
	  length = view.size.height * (0.2 + (0.5 * Math.random())),
	  size = randomRange(64, 396),
	  color = getRandomColor();

  var trail = new Line(startPoint, angle, length, color),
	  hex = new Hex(trail.end, size, color);

  tl.add(trail.animate());
  tl.add('trailDone');

  tl.add(hex.animate(), 'trailDone');

  for (var i = 0; i < hex.sides; i++) {

	  var point = hex.targetHex.segments[i].point,
		  localPoint = point - hex.targetHex.position;

	  var spark = new Line(trail.end, localPoint.angle, size * 2, color);

	  tl.add(spark.animate(), 'trailDone');
  }

  return tl;
}

////////////
// FIRST RUN
////////////

var canvasses = document.getElementsByClassName("fireworkscanvas");

console.log("current fireworks elements count: " + canvasses.length.toString());
if(canvasses.length/4>2){
	console.log("Removing all the canvasses due detected excessive canvas count");
	removeAllCanvasses();
	var canvasses = document.getElementsByClassName("fireworkscanvas");
}

if(canvasses.length/4>1){
	console.log("Removing self due to too much canvasses");
	removeSelf();
}

////////////
// UPDATE
////////////

nextTimer = 40;
timer = 0;
function onFrame(e) {
	
	// some code to try to make the fireworks remove themselves if duplicate...
	/*if(typeof fireworklock !== 'undefined'){
		if(fireworklock e.count){
			console.log("there are already fireworks, returning")
			removeSelf();
			return;
		}
	}
	fireworklock = true;*/
	timer += 1;
	if (timer > nextTimer && (e.count < time*60 || partyMode)) {
		createFirework();
		nextTimer = (10 + (30 * Math.random()))/multiplier;
		timer = 0;
	}

	if(e.count > (time*60)+300 && !partyMode){
		//fireworklock = false;
		removeSelf();
	}
}

////////////
// utils
////////////

function getRandomColor() {
  return new Color({
	  hue:randomRange(0, 100),
	  saturation:0.75,
	  lightness:0.5
  })
}

function randomIndex(arr) {
  return arr[randomRange(0, arr.length, true)];
}

function randomRange(min, max, floor) {
  var v = min + Math.random() * (max - min);
  floor = floor || false;
  return floor ? (v | 0) : v;
}

function removeSelf() {
    removeElement("fireworkscanvas" + canvashash);
	removeElement("fireworkscanvascode" + canvashash);
	removeElement("helpers1" + canvashash);
	removeElement("helpers2" + canvashash);
}

function removeAllCanvasses (){
	console.log("Removing all the canvasses")
	var canvasses = document.getElementsByClassName("fireworkscanvas");
	for (var i = 0; i < canvasses.length; i++){
		canvasses[i].parentNode.removeChild(canvasses[i]);
	}
}

function removeElement(elementId) {
	//console.log(elementId);
    // Removes an element from the document
    var element = document.getElementById(elementId);
	//console.log(element);
	if(element){
		element.parentNode.removeChild(element);
	}else{
		removeAllCanvasses();
	}
}