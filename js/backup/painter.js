/**
 * Painter
 */
var ImagePainter = function(imageUrl) {
	this.image = new Image();
	this.image.src = imageUrl;
	if (typeof this.paint != "function") {
		ImagePainter.prototype.paint = function(sprite, context) {
			if (this.image.complete) {
				context.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height);
			}
		};
	}
};

var SheetPainter = function(sheetUrl, cells) {
	this.cells = cells || [];
	this.cellIndex = 0;
	this.sheet = new Image();
	this.sheet.src = sheetUrl;
	if (typeof this.paint != "function") {
		SheetPainter.prototype.advance = function() {
			if (this.cellIndex == this.cells.length - 1) {
				this.cellIndex = 0;
			} else {
				this.cellIndex++;
			}
		};
		SheetPainter.prototype.paint = function(sprite, context) {
			if (this.sheet.complete) {
				var cell = this.cells[this.cellIndex];
				context.drawImage(this.sheet, cell.x, cell.y, cell.w, cell.h, sprite.left, sprite.top, cell.w, cell.h);
			}
		};
	}
};