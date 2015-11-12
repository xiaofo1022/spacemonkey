/**
 * Monkey
 */
var Sprite = function() {
	this.frames = [];
	this.items = [];
	this.bombs = [];
	this.buttons = [];
	this.loadedImage = 0;
	this.currentFrame = 0;
	this.baseUri = "images/";
	this.images = [
	               {src:"monkey1.png"}, {src:"monkey2.png"}, {src:"monkey3.png"}, {src:"monkey4.png"}, {src:"monkey5.png"},
	               {src:"iphone.png", score: 20}, {src:"imac.png", score: 30}, {src:"ipod.png", score: 5}, {src:"ipad.png", score: 15},
	               {src:"burn.png", hurt: 20}, 
	               {src:"retry.png", button: 20}];
	this.init = function() {
		var monkey = this;
		var images = monkey.images;
		
		for (var i = 0; i < images.length; i++) {
			var data = images[i];
			var img = new Image();
			img.src = monkey.baseUri + data.src;
			img.data = data;
			img.onload = function(e) {
				var data = this.data;
				monkey.loadedImage++;
				if (data.button) {
					monkey.buttons.push(this);
				} else if (data.hurt) {
					this.hurt = data.hurt;
					monkey.bombs.push(this);
				} else if (data.score) {
					this.score = data.score;
					monkey.items.push(this);
				} else {
					monkey.frames.push(this);
				}
			}
		}
	};
	this.isLoaded = function() {
		return this.loadedImage == this.images.length;
	};
};
