/**
 * Box2D
 */
var Box = function() {
	this.b2Vec2 = Box2D.Common.Math.b2Vec2;
	this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	this.b2Body = Box2D.Dynamics.b2Body;
	this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	this.b2Fixture = Box2D.Dynamics.b2Fixture;
	this.b2World = Box2D.Dynamics.b2World;
	this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	this.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	this.b2ContactListener = Box2D.Dynamics.b2ContactListener;
	this.scale = 30;
};

Box.prototype = {
	constructor: Box,
	
	bodyList: [],
	
	groundList: [],
	
	bombList: [],
	
	score: 0,
	
	lastTime: 0,
	
	hero: null,
	
	mode: "normal",
	
	setContext: function(context) {
		Box.prototype.context = context;
	},
	
	setSprite: function(sprite) {
		Box.prototype.sprite = sprite;
	},
	
	createGravity: function(x, y) {
		return new this.b2Vec2(x, y);
	},
	
	createWorld: function(gravity, allowSleep) {
		var world = new this.b2World(gravity, allowSleep);
		Box.prototype.world = world;
		return world;
	},
	
	createBody: function(world, centerX, centerY, isStatic, userData) {
		var bodyDef = new this.b2BodyDef();
		if (isStatic) {
			bodyDef.type = this.b2Body.b2_staticBody;
		} else {
			bodyDef.type = this.b2Body.b2_dynamicBody;
		}
		bodyDef.position.x = centerX / this.scale;
		bodyDef.position.y = centerY / this.scale;
		var body = world.CreateBody(bodyDef);
		if (userData != undefined) {
			body.SetUserData(userData);
			if (userData.name == "monkey") {
				Box.prototype.hero = body;
			} else if (userData.name == "banana") {
				if (Box.prototype.bodyList.length < 11) {
					Box.prototype.bodyList.push(body);
				} else {
					return null;
				}
			} else if (userData.name == "bomb") {
				if (Box.prototype.bombList.length < 5) {
					Box.prototype.bombList.push(body);
				} else {
					return null;
				}
			} else {
				if (isStatic) {
					Box.prototype.groundList.push(body);
				}
			}
		}
		return body;
	},
	
	createFixtureDef: function(density, friction, restitution) {
		var fixtureDef = new this.b2FixtureDef();
		fixtureDef.density = density;
		fixtureDef.friction = friction;
		fixtureDef.restitution = restitution;
		return fixtureDef;
	},
	
	createRect: function(body, density, friction, restitution, width, height) {
		var fixtureDef = this.createFixtureDef(density, friction, restitution);
		fixtureDef.shape = new this.b2PolygonShape();
		fixtureDef.shape.SetAsBox(width / 2 / this.scale, height / 2 / this.scale);
		return body.CreateFixture(fixtureDef);
	},
	
	createPolygon: function(body, density, friction, restitution, points) {
		var fixtureDef = this.createFixtureDef(density, friction, restitution);
		fixtureDef.shape = new this.b2PolygonShape();
		var pointVecs = [];
		for (var i = 0; i < points.length; i++) {
			var point = points[i];
			var x = point.x == 0 ? 0 : point.x / this.scale;
			var y = point.y == 0 ? 0 : point.y / this.scale;
			var vec = new this.b2Vec2(x, y);
			pointVecs.push(vec);
		}
		fixtureDef.shape.SetAsArray(pointVecs, pointVecs.length);
		return body.CreateFixture(fixtureDef);
	},
	
	createCircle: function(body, density, friction, restitution, radius) {
		var fixtureDef = this.createFixtureDef(density, friction, restitution);
		fixtureDef.shape = new this.b2CircleShape(radius / this.scale);
		return body.CreateFixture(fixtureDef);
	},
	
	createJoint: function(world, body1, body2, jointX, jointY) {
		var jointDef = new this.b2RevoluteJointDef();
		var jointCenter = new this.b2Vec2(jointX / this.scale, jointY / this.scale);
		jointDef.Initialize(body1, body2, jointCenter);
		world.CreateJoint(jointDef);
	},
	
	debugDraw: function(world, context, fillAlpha, lineThickness) {
		var debugDraw = new this.b2DebugDraw();
		debugDraw.SetSprite(context);
		debugDraw.SetDrawScale(this.scale);
		debugDraw.SetFillAlpha(fillAlpha);
		debugDraw.SetLineThickness(lineThickness);
		debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
		//world.DrawDebugData();
	},
	
	destoryBodies: function(world) {
		var bodyList = Box.prototype.bodyList;
		var bombList = Box.prototype.bombList;
		var i = 0;
		var data;
		for (i = 0; i < bodyList.length; i++) {
			var body = bodyList[i];
			data = body.GetUserData();
			if (data != undefined && data.life <= 0) {
				world.DestroyBody(body);
				body = undefined;
				bodyList.splice(i, 1);
				if (data.score) {
					Box.prototype.score += data.score;
				}
			}
		}
		for (i = 0; i < bombList.length; i++) {
			var bomb = bombList[i];
			data = bomb.GetUserData();
			if (data != undefined && data.life <= 0) {
				world.DestroyBody(bomb);
				bomb = undefined;
				bombList.splice(i, 1);
			}
		}
	},
	
	animate: function(time) {
		var pro = Box.prototype;
		var world = pro.world;
		var timeStep = 1 / 30;
		var velocityIterations = 8;
		var positionIterations = 3;
		world.Step(timeStep, velocityIterations, positionIterations);
		//world.ClearForces();
		//world.DrawDebugData();
		
		pro.drawGround();
		pro.drawMonkey(time);
		pro.drawBanana();
		pro.drawBomb(time);
		pro.destoryBodies(world);
		pro.drawScore();
		pro.drawLife();
			
		if (pro.mode == "normal") {
			window.requestAnimation(arguments.callee);
		} else {
			pro.drawEndScreen();
		}
	},
	
	initListener: function(world) {
		var listener = new this.b2ContactListener();
		listener.PostSolve = function(contact, impulse) {
			var bodyA = contact.GetFixtureA().GetBody();
			var bodyB = contact.GetFixtureB().GetBody();
			var dataA = bodyA.GetUserData();
			var dataB = bodyB.GetUserData();
			var hero = Box.prototype.hero;
			var heroData = hero.GetUserData();
			if (dataA != undefined) {
				if (dataA.name == "banana") {
					dataA.life = 0;
				} else if (dataA.name == "bomb") {
					dataA.life = 0;
					heroData.life -= 20;
				}
			}
			if (dataB != undefined) {
				if (dataB.name == "banana") {
					dataB.life = 0;
				} else if (dataB.name == "bomb") {
					dataB.life = 0;
					heroData.life -= 20;
				}
			}
			if (heroData.life <= 0) {
				Box.prototype.mode = "end";
			}
		};
		world.SetContactListener(listener);
	},
	
	initMouseDown: function(canvas) {
		var box = this;
		canvas.onmousedown = function(e) {
			if (box.mode != "end") {
				var hero = box.hero;
				if (hero != null) {
					var position = hero.GetPosition();
					var positionX = position.x * box.scale;
					var loc = util.windowToCanvas(canvas, e.clientX, e.clientY);
					var xpulse;
					if (positionX < loc.x - 10) {
						xpulse = -0.2;
					} else {
						xpulse = 0.2;
					}
					var impulse = new box.b2Vec2(xpulse, -0.2);
					hero.ApplyImpulse(impulse, hero.GetWorldCenter());
				}
			} else {
				var pro = Box.prototype;
				pro.bodyList = [];
				pro.groundList = [];
				pro.bombList = [];
				pro.score = 0;
				pro.lastTime = 0;
				pro.hero = null;
				pro.mode = "normal";
				pro.context.canvas.style.cursor = "default";
				init();
			}
		};
	},
	
	drawMonkey: function(time) {
		var pro = Box.prototype;
		var monkey = pro.sprite;
		var lastTime = pro.lastTime;
		var context = pro.context;
		var hero = pro.hero;
		
		if (monkey.frames.length > 0 && hero != null) {
			var monkeyFrame = monkey.frames[monkey.currentFrame];
			
			if (time - lastTime > 200) {
				monkey.currentFrame++;
				if (monkey.currentFrame == monkey.frames.length) {
					monkey.currentFrame = 0;
				}
				pro.lastTime = time;
			}
			
			var sw = monkeyFrame.width;
			var sh = monkeyFrame.height;
			var scale = 30;
			var userData = hero.GetUserData();
			
			if (userData != undefined) {
				var position = hero.GetPosition();
				context.save();
				context.translate(position.x * scale, position.y * scale);
				context.drawImage(monkeyFrame, 
					0, 0, sw, sh,
					-sw / 2, - sh / 2, sw, sh);	
				context.restore();
			}
		}
	},
	
	drawGround: function() {
		var pro = Box.prototype;
		var groundList = pro.groundList;
		var context = pro.context;
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.save();
		context.fillStyle = "green";
		for (var i = 0; i < groundList.length; i++) {
			var ground = groundList[i];
			var groundData = ground.GetUserData();
			context.fillRect(groundData.x, groundData.y, groundData.w, groundData.h);
		}
		context.restore();
	},
	
	drawBanana: function() {
		var pro = Box.prototype;
		var bodyList = pro.bodyList;
		var context = pro.context;
		var monkey = pro.sprite;
		var maxItem = monkey.items.length;
		var scale = 30;
		
		for (var i = 0; i < bodyList.length; i++) {
			var body = bodyList[i];
			var userData = body.GetUserData();
			
			if (userData != undefined) {
				var banana;
				if (userData.img == undefined) {
					var randomIndex = pro.getRandomIndex(maxItem);
					banana = monkey.items[randomIndex];
					userData.img = banana;
					userData.score = banana.score;
				} else {
					banana = userData.img;
				}
				var sw = banana.width;
				var sh = banana.height;
				var position = body.GetPosition();
				context.save();
				context.translate(position.x * scale, position.y * scale);
				context.drawImage(banana, 
					0, 0, sw, sh,
					-sw / 2, - sh / 2, sw, sh);	
				context.restore();
			}
		}
	},
	
	drawBomb: function(time) {
		var pro = Box.prototype;
		var bombList = pro.bombList;
		var context = pro.context;
		var monkey = pro.sprite;
		var scale = 30;
		
		for (var i = 0; i < bombList.length; i++) {
			var body = bombList[i];
			var userData = body.GetUserData();
			
			if (userData != undefined) {
				var bomb;
				if (userData.img == undefined) {
					bomb = monkey.bombs[0];
					userData.img = bomb;
					userData.hurt = bomb.hurt;
				} else {
					bomb = userData.img;
				}
				if (userData.time == undefined) {
					userData.time = time;
				}
				if (time - userData.time >= 5000) {
					userData.life = 0;
				}
				var sw = bomb.width;
				var sh = bomb.height;
				var position = body.GetPosition();
				context.save();
				context.translate(position.x * scale, position.y * scale);
				context.drawImage(bomb, 
					0, 0, sw, sh,
					-sw / 2, - sh / 2, sw, sh);	
				context.restore();
			}
		}
	},
	
	drawScore: function() {
		var pro = Box.prototype;
		var context = pro.context;
		var score = pro.score;
		context.save();
		context.font = "16px Arial";
		context.textAlign = "right";
		context.fillStyle = "rgba(255, 225, 0, 1.0)";
		context.fillText(score, canvas.width - 20, 30);
		context.restore();
	},
	
	drawLife: function() {
		var pro = Box.prototype;
		var context = pro.context;
		var heroData = pro.hero.GetUserData();
		context.save();
		context.font = "16px Arial";
		context.textAlign = "left";
		context.fillStyle = "red";
		context.fillText(heroData.life, 20, 30);
		context.restore();
	},
	
	drawEndScreen: function() {
		var pro = Box.prototype;
		var context = pro.context;
		var canvas = context.canvas;
		context.save();
		context.fillStyle = "rgba(121, 122, 121, 0.6)";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();
		context.save();
		context.font = "32px Arial";
		context.textAlign = "center";
		context.fillStyle = "rgba(245, 75, 8, 0.8)";
		context.fillText("Game Over You Asshole! Hahahaha!", canvas.width / 2, canvas.height / 2);
		context.fillText("Your Final Score: " + pro.score, canvas.width / 2, canvas.height / 2 + 48);
		context.drawImage(monkey.buttons[0], 0, 0, 32, 32, canvas.width / 2, canvas.height / 2 + 70, 32, 32);
		context.restore();
		canvas.style.cursor = "pointer";
		canvas.onclick = pro.retry;
	},
	
	getRandomIndex: function(max) {
		return Math.floor(Math.random() * max);
	}
};