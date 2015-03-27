# clock.js
The fast, lightweight, easy-to-use JavaScript clock plugin

http://www.michalpaszkiewicz.co.uk/clockjs/

How to use
===========
To use this plugin, simply add the following code to your page:

```
<canvas id="my-canvas"></canvas>
<script src="http://www.michalpaszkiewicz.co.uk/clockjs/clock.js"></script>
<script>
	var myClock = new clock("my-canvas");
	myClock.start();
</script>
```

The clock can be customised with any or all of the following options, which can be values or functions:

```
var options = {
	//The radius of the clock
	radius: function(){ return Math.min(self.canvas.height, self.canvas.width) / 2 },
					
	//The width of the frame/rim
	rim: function(){ return getValue("radius") * 0.2; },
							
	//The colour of the frame/rim
	rimColour: "rgba(0,0,0,0.1)",
							
	//x position of centre of clock
	x: function(){ return self.canvas.width / 2 },
							
	//y position of centre of clock
	y: function(){ return self.canvas.height / 2 },
							
	//default colour of the clock
	colour:"rgba(255,0,0,0.2)",
							
	//the colour of the lines on the clock
	lineColour: function(){ return self.options.colour; },
							
	//the fill colour on the hands
	fillColour: function(){  return self.options.colour; },
							
	//default line width
	lineWidth: 1,
							
	//set to true to display the centre circle
	centreCircle: true,
							
	// radius of centre circle
	centreCircleRadius: function(){ return getValue("radius") * 0.03; },
							
	//colour of centre circle
	centreCircleColour: function(){return getValue("colour");},
							
	//radius of centre circle cutout
	centreCircleCutout: function(){ return getValue("radius") * 0.01; },
							
	//amount of hours to add to current time
	addHours: 0,
							
	//amount of minutes to add to current time
	addMinutes: 0,
							
	//amount of seconds to add to current time
	addSeconds: 0,
							
	//set to -1 to make the clock go anti-clockwise
	directionCoefficient: 1
}	
						
var myClock = new clock("my-canvas", options);
myClock.start();
```

By default the clock will fit to the parent container, so to set the size, just set the size of the element that contains the canvas.

Handle multiple clocks
-------------------------

For creating multiple clocks, clock.js has a clockMaker object, which can be used to handle multiple clocks. It can be used like this:

```var myClockMaker = new clockMaker();

myClockMaker.addClock(myClock1);
myClockMaker.addClock(myClock2);

myClockMaker.start();```

Single clocks can be started or stopped by changing their started value inside the clockMaker, like this:

```myClockMaker.clocks[1].started = false;```