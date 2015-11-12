/**
 * Polygon
 */
var Point = function(x, y) {
	this.x = x;
	this.y = y;
};
	
var Polygon = function(centerX, centerY, radius, sides, startAngle) {
	this.x = centerX;
	this.y = centerY;
	this.radius = radius;
	this.sides = sides;
	this.startAngle = startAngle;
};

Polygon.prototype = {
	getPoints: function() {
		var points = [];
		var angle = this.startAngle || 0;
		for (var i = 0; i < this.sides; i++) {
			points.push(new Point(this.x + this.radius * Math.sin(angle), this.y - this.radius * Math.cos(angle)));
			angle += 2 * Math.PI / this.sides;
		}
		return points;
	},
	createPath: function(context) {
		var points = this.getPoints();
		context.beginPath();
		context.moveTo(points[0].x, points[0].y);
		for (var i = 1; i < this.sides; i++) {
			context.lineTo(points[i].x, points[i].y);
		}
		context.closePath();
	},
	stroke: function(context) {
		this.createPath(context);
		context.stroke();
	},
	fill: function(context) {
		this.createPath(context);
		context.fill();
	},
	move: function(x, y) {
		this.x = x;
		this.y = y;
	}
};