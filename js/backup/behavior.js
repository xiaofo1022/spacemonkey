/**
 * Behavior
 */
var PlaySheet = function() {
	this.lastTime = 0;
	this.PAGEFILE_INTERVAL = 100;
	if (typeof this.execute != "function") {
		PlaySheet.prototype.execute = function(sprite, context, time) {
			if (time - this.lastTime > this.PAGEFILE_INTERVAL) {
				sprite.painter.advance();
				this.lastTime = time;
			}
		};
	}
};

var LeftToRightMove = function() {
	this.lastTime = 0;
	if (typeof this.execute != "function") {
		LeftToRightMove.prototype.execute = function(sprite, context, time) {
			if (this.lastTime != 0) {
				sprite.left -= sprite.velocityX * ((time - this.lastTime) / 100);
				if (sprite.left < 0) {
					sprite.left = canvas.width;
				}
			}
			this.lastTime = time;
		};
	}
};