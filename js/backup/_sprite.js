/**
 * Sprite
 */
var Sprite = function(name, painter, behaviors) {
	if (name != undefined) {
		this.name = name;
	}
	if (painter != undefined) {
		this.painter = painter;
	}
	this.top = 0;
	this.left = 0;
	this.width = 10;
	this.height = 10;
	this.velocityX = 10;
	this.velocityY = 10;
	this.visible = true;
	this.animating = false;
	this.behaviors = behaviors || [];
	if (typeof this.paint != "function") {
		Sprite.prototype.paint = function(context) {
			if (this.painter != undefined && this.visible) {
				this.painter.paint(this, context);
			}
		};
		
		Sprite.prototype.update = function(context, time) {
			for (var i = 0; i < this.behaviors.length; i++) {
				this.behaviors[i].execute(this, context, time);
			}
		};
	}
};

var SpriteAnimator = function(painters, elapsedCallback) {
	this.painters = painters || [];
	this.elapsedCallback = elapsedCallback;
	this.duration = 1000;
	this.startTime = 0;
	this.index = 0;
	if (typeof this.start != "function") {
		SpriteAnimator.prototype.start = function(sprite, duration) {
			var endTime = new Date().getTime() + duration;
			var period = duration / this.painters.length;
			var originalPainter = sprite.painter;
			var lastUpdate = 0;
			var animator = this;
			this.index = 0;
			sprite.animating = true;
			sprite.painter = this.painters[this.index];
			window.requestAnimation(function spriteAnimate(time) {
				if (time < endTime) {
					if ((time - lastUpdate) > period) {
						sprite.painter = animator.painters[++animator.index];
						lastUpdate = time;
					}
					window.requestAnimation(spriteAnimate);
				} else {
					animator.end(sprite, originalPainter);
				}
			});
		};
		SpriteAnimator.prototype.end = function(sprite, originalPainter) {
			sprite.animating = false;
			if (this.elapsedCallback) {
				this.elapsedCallback(sprite);
			} else {
				sprite.painter = originalPainter;
			}
		};
	}
};