function draw() {
	//var index = getRandomIndex();
	var index = 0;
	var starScale = getRandomStarScale();
	switch (index) {
		case 0:
			drawStones();
			break;
		case 1:
			drawCircles();
			break;
		case 2:
			drawStars(undefined, undefined, starScale);
			break;
		case 3:
			drawMachine();
			break;
		default:
			drawStones();
	}
	setTimeout(draw, 500);
}

function drawCircles() {
	var circleBody = box.createBody(world, getRandomStartX(), START_Y, false, {name:"Circle", life:100});
	var circle = box.createCircle(circleBody, 0.2, 0.5, 0.2, getRandomSize());
}

function drawStars(startX, startY, scale) {
	var points = [
	              {x:0, y:0},
	              {x:15, y:20},
	              {x:40, y:20},
	              {x:25, y:40},
	              {x:35, y:65},
	              {x:0, y:50},
	              {x:-35, y:65},
	              {x:-25, y:40},
	              {x:-40, y:20},
	              {x:-15, y:20}];
	scale = scale == undefined ? 1.0 : scale;
	for (var i = 0; i < points.length; i++) {
		var point = points[i];
		point.x = point.x * scale;
		point.y = point.y * scale;
	}
	var centerX = startX == undefined ? getRandomStartX() : startX;
	var centerY = startY == undefined ? START_Y : startY;
	var starBody = box.createBody(world, centerX, START_Y, false, {name:"Star", life:150});
	var star = box.createPolygon(starBody, 1.0, 0.5, 0.2, points);
	return starBody;
}

function drawMachine() {
	var rectX = getRandomStartX();
	var starBody = drawStars(rectX, START_Y / 2);
	var rectBody = box.createBody(world, rectX, START_Y / 2, false, {name:"Joint", life:50});
	var rect = box.createRect(rectBody, 1.0, 0.5, 0.3, 80, 20);
	box.createJoint(world, starBody, rectBody, rectX, START_Y / 2)
}

function getRandomSize() {
	return Math.floor(Math.random() * 50 + 10);
}

function getRandomStarScale() {
	return Math.random().toFixed(1);
}

function getRandomIndex() {
	return Math.floor(Math.random() * 4 + 0);
}