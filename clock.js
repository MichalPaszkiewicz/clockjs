Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addMinutes = function(m){
	this.setMinutes(this.getMinutes()+m);
	return this;
}

Date.prototype.addSeconds = function(s){
	this.setSeconds(this.getSeconds()+s);
	return this;
}

var clock = function(id, options){
	var self = this;

	//initialise canvas && context
	self.canvas = document.getElementById(id);
	self.context = self.canvas.getContext("2d");

	//default options
	self.options = {
		radius: function(){ return Math.min(self.canvas.height, self.canvas.width) / 2 },
		rim: function(){ return getValue("radius") * 0.2; },
		rimColour: "black",
		x: function(){ return self.canvas.width / 2 },
		y: function(){ return self.canvas.height / 2 },
		colour:"rgba(255,0,0,0.2)",
		lineColour: function(){ return self.options.colour; },
		fillColour: function(){  return self.options.colour; },
		lineWidth: 1,
		centreCircle: true,
		centreCircleRadius: function(){ return getValue("radius") * 0.03; },
		centreCircleColour: function(){return getValue("colour");},
		centreCircleCutout: function(){ return getValue("radius") * 0.01; },
		date: new Date(),
		addHours: 0,
		addMinutes: 0,
		addSeconds: 0,
		directionCoefficient: 1
	};
	
	//hands settings
	self.hands = {
		secondHand:{
			length: 1, width: 0.1, 
			percentile:function(){
				return (getValue("date", function(){return new Date()} ).getSeconds() + getValue("date").getMilliseconds() / 1000) / 60;
			}},
		minuteHand:{
			length: 0.9, width: 0.4, 
			percentile:function(){
				return (getValue("date", function(){return new Date()} ).getMinutes() + getValue("date").getSeconds() / 60) / 60;
			}},
		hourHand:{
			length: 0.5, width: 0.9, 
			percentile:function(){
				return (getValue("date", function(){return new Date()} ).getHours() + getValue("date").getMinutes() / 60) / 12;
			}}
	}
	
	//set specified options
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			self.options[key] = options[key];
		}
	}
	
	//get function - gets a function, otherwise value.
	var getValue = function(name, defaultName){
		if(name == null){
			if(defaultName == null){
				throw new Error("No value set for this option.");
			}
			if(typeof defaultName == "function"){
				return defaultName();
			}
			return (typeof self.options[defaultName] == "function") ? self.options[defaultName]() : self.options[defaultName];
		}
		if(self.options == null){
			throw new Error("Someone has deleted the clock's options. Uh-oh!");
		}
		if(typeof self.options[name] == "function"){
			var result = self.options[name]();
			if(result != null){
				return result;
			}
			if(typeof defaultName == "function"){
				return defaultName();
			}
			return (typeof self.options[defaultName] == "function") ? self.options[defaultName]() : self.options[defaultName];
		}
		else {
			return self.options[name];
		}
	}
	
	//for drawing a handleEvent
	var drawHand = function(x, y, radius, theta, lineWidth){
		
		self.context.lineWidth = 1;
		self.context.beginPath();
		self.context.moveTo(x,y);
		var offAmount = (lineWidth != null) ? lineWidth : 0.5;
		var one = {x: x + 2 * radius / 8 * Math.cos(theta + offAmount), y: y + 2 * radius / 8 * Math.sin(theta + offAmount)};
		var two = {x: x, y: y};
		var one2 = {x: x + 2 * radius / 8 * Math.cos(theta - offAmount), y: y + 2 * radius / 8 * Math.sin(theta - offAmount)};
		var finalx = x + radius * Math.cos(theta);
		var finaly = y + radius * Math.sin(theta);
		self.context.bezierCurveTo(one.x, one.y, two.x, two.y, finalx,finaly);
		self.context.bezierCurveTo(two.x, two.y, one2.x, one2.y, x,y);
		self.context.stroke();
		self.context.fill();
		self.context.lineWidth = 1;	
	}
	
	//update the date, change time zone etc.
	var updateDate = function(){
		//update date;		
		self.options.date = new Date();
		self.options.date.addHours(getValue("addHours", function(){return 0;}));
		self.options.date.addMinutes(getValue("addMinutes", function(){return 0;}));
		self.options.date.addSeconds(getValue("addSeconds", function(){return 0;}));
	}
	
	//updates and draws clock			
	self.update = function(){
		self.canvas.height = self.canvas.parentNode.offsetHeight;
		self.canvas.width = self.canvas.parentNode.offsetWidth;
		
		var radius = getValue("radius");
		var x = getValue("x");
		var y = getValue("y");
		
		self.context.clearRect(0,0, self.canvas.width, self.canvas.height);

		//outer circle
		self.context.strokeStyle = getValue("rimColour");
		self.context.lineWidth = getValue("rim");
		self.context.beginPath();
		self.context.arc(x,y,radius - getValue("rim")/2,0,2*Math.PI);
		self.context.stroke();
			
		self.context.strokeStyle = getValue("lineColour");
		self.context.fillStyle = getValue("fillColour");
		self.context.lineWidth = getValue("lineWidth");
		
		//numbers
		
		updateDate();
		
		var directionCoefficient = getValue("directionCoefficient", function(){return 1;});
	
		//draw all hands
		for (var key in self.hands) {
			if (self.hands.hasOwnProperty(key)) {
				var tempTheta = directionCoefficient * self.hands[key].percentile() * 2 * Math.PI - Math.PI / 2;
				var tempRadius = radius * self.hands[key].length;
				drawHand(x, y, tempRadius, tempTheta, self.hands[key].width);
			}
		}
			
		//centreCircle
		if(getValue("centreCircle")){	
			self.context.beginPath();
			self.context.fillStyle = getValue("centreCircleColour", "colour");
			self.context.arc(x,y,getValue("centreCircleRadius"),0,2*Math.PI);
			self.context.fill();
			self.context.stroke();
			
			//cutout
			self.context.beginPath();
			self.context.arc(x,y,getValue("centreCircleCutout"),0,2*Math.PI);
			self.context.clip();
			self.context.clearRect(0,0,self.canvas.width, self.canvas.height);
		}
	
		window.requestAnimationFrame(self.update);
	};

	self.start = function(){
		self.update();
	};
	
	return self;
}
		
