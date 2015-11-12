/**
 * Monkey Game
 */
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var box = new Box();
var world;
var monkey = new Sprite();
var START_Y = 20;

monkey.init();
initSprite();

function initSprite() {
	if (!monkey.isLoaded()) {
		setTimeout(initSprite, 100);
	} else {
		init();
	}
}

function init() {
	util.initAnimation();
	var gravity = box.createGravity(0, 0.8);
	world = box.createWorld(gravity, true);
	box.initMouseDown(canvas);
	box.initListener(world);
	box.setContext(context);
	box.setSprite(monkey);
	createWalls();
	createMonkey();
	createBananas();
	createBombs();
	//box.debugDraw(world, context, 0.6, 1.0);
	box.animate();
}

function createWalls() {
	//Ground
	var GROUND_THICK = 10;
	var bodyData = createGroundData(0, canvas.height - GROUND_THICK, canvas.width, GROUND_THICK);
	var staticBody = box.createBody(world, canvas.width / 2, canvas.height - 5, true, bodyData);
	box.createRect(staticBody, 1.0, 0.5, 0.2, canvas.width, 10);
	//Left Wall
	bodyData = createGroundData(0, 0, GROUND_THICK, canvas.height);
	staticBody = box.createBody(world, 5, 0, true, bodyData);
	box.createRect(staticBody, 1.0, 0.5, 0.2, 10, canvas.height * 2);
	//Right Wall
	bodyData = createGroundData(canvas.width - GROUND_THICK, 0, GROUND_THICK, canvas.height);
	staticBody = box.createBody(world, canvas.width - 5, 0, true, bodyData);
	box.createRect(staticBody, 1.0, 0.5, 0.2, 10, canvas.height * 2);
	//Top Wall
	bodyData = createGroundData(0, 0, canvas.width, GROUND_THICK);
	staticBody = box.createBody(world, canvas.width / 2, 5, true, bodyData);
	box.createRect(staticBody, 1.0, 0.5, 0.2, canvas.width, 10);
}

function createGroundData(x, y, w, h, name, life) {
	var obj = new Object();
	obj.x = x;
	obj.y = y;
	obj.w = w;
	obj.h = h;
	if (name != undefined) {
		obj.name = name;
	}
	if (life != undefined) {
		obj.life = life;
	}
	return obj;
}

function createMonkey() {
	var monkeyBody = box.createBody(world, getRandomStartX(), START_Y, false, {name:"monkey", life:100});
	box.createRect(monkeyBody, 0.1, 0.5, 0, 24, 24);
}

function createItem(itemName, life) {
	var ITEM_SIZE = 32;
	var startX = getRandomStartX();
	var startY = getRandomStartY();
	var bodyData = createGroundData(startX, startY, ITEM_SIZE, ITEM_SIZE, itemName, life);
	var staticBody = box.createBody(world, startX, startY, true, bodyData);
	if (staticBody != null) {
		box.createRect(staticBody, 1.0, 0.5, 0, ITEM_SIZE, ITEM_SIZE);
	}
}

function createBananas() {
	createItem("banana", 10);
	setTimeout(createBananas, 1000);
}

function createBombs() {
	createItem("bomb", 10);
	setTimeout(createBombs, 1500);
}

function getRandomStartX() {
	return Math.floor(Math.random() * (canvas.width - 80) + 80);
}

function getRandomStartY() {
	return Math.floor(Math.random() * (canvas.height - 80) + 80);
}