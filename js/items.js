/**
 * Items
 */
var Items = function() {
	this.items = {};
	this.itemCount = 16;
	this.loadedCount = 0;
	this.baseUrl = "images/items/";
	this.loadItem(this.baseUrl + "red.png", 0, 0, 0, 0);
	this.loadItem(this.baseUrl + "grass.png", 0, 0, 0, 0);
	this.loadItem(this.baseUrl + "bush.png", 5, 4, 4, 10);
	this.loadItem(this.baseUrl + "trees.png", 20, 2, 2, 15);
	this.loadItem(this.baseUrl + "bottle.png", 0, 0, 0, 0);
	this.loadItem(this.baseUrl + "spade.png", 0, 0, 0, 0, true);
	this.loadItem(this.baseUrl + "desert.png", 0, 0, 0, 0, true);
	this.loadItem(this.baseUrl + "boom.png", 0, 0, 0, 100);
	this.loadItem(this.baseUrl + "blast.png", 0, 0, 0, 0, true);
	this.loadItem(this.baseUrl + "fire.png", 0, 0, 0, 0, true);
};

Items.prototype = {
	loadItem: function(url, life, exp, money, cost, dontNeedDieImg) {
		var instance = this;
		var img = new Image();
		img.src = url;
		img.onload = function(e) {
			var imgName = util.getImageName(this.src);
			var item = new Item(imgName, life, exp, money, cost, this);
			instance.items[imgName] = item;
			instance.loadedCount++;
			if (!dontNeedDieImg) {
				instance.loadDieItem(item);
			}
		};
	},
	
	loadDieItem: function(item) {
		var instance = this;
		var img = new Image();
		img.src = this.baseUrl + item.name + "_die.png";
		img.onload = function(e) {
			item.setDieImg(this);
			instance.loadedCount++;
		}
	},
	
	isLoaded: function() {
		return this.itemCount == this.loadedCount;
	}
};