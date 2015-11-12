/**
 * Show Record
 */
var musicInfo = document.querySelector("#music-info");
var musicPlayer = document.querySelector("#music-player");
var musicButton = document.querySelector("#music-button");
var musicTime = document.querySelector("#music-time");
var labelList = document.querySelector("#label-list");
var articleCount = 0;

getArticles();
getMusics();

function getArticles() {
	util.doGet("articles/getArticles", function(data) {
		if (data != null) {
			articleCount = data.length;
			createArticles(data);
			getLabels();
		}
	});
}
	
function getMusics() {
	util.doGet("music/getMusics/0", function(list) {
		if (list != null) {
			var music = list[0];
			var info = music.author + " - " + music.title;
			var url = "music/" + music.authorPath + "/" + music.albumPath + "/" + music.fileName + music.suffix;
			musicInfo.innerHTML = info;
			musicPlayer.src = url;
		}
	});
}

function getLabels() {
	util.doGet("label/getAllLabels", function(list) {
		if (list != null) {
			var listHtml = "";
			listHtml += ("<li><a id='all-label-link' onclick='getArticles()'>全部 (" + articleCount + ")" + "</a></li>");
			for (var i = 0; i < list.length; i++) {
				var data = list[i];
				listHtml += ("<li><a onclick='getArticlesByLabel(" + data.id + ")'>" + data.name + " (" + data.count + ")" + "</a></li>");
			}
			labelList.innerHTML = listHtml;
		}
	});
}

function getArticlesByLabel(labelId) {
	util.doGet("articles/getArticlesByLabel/" + labelId, function(list) {
		if (list != null) {
			createArticles(list);
		}
	});
}

function getArticle(articleId) {
	util.doGet("articles/getArticle/" + articleId, function(data) {
		if (data != null) {
			var blogMain = document.querySelector("#blog-main");
			blogMain.innerHTML = createBlogBody(data);
		}
	});
}

function createArticles(list) {
	var blogMain = document.querySelector("#blog-main");
	blogMain.innerHTML = "";
	var blogBody = "";
	for (var i = 0; i < list.length; i++) {
		blogBody += createBlogBody(list[i]);
	}
	blogMain.innerHTML = blogBody;
}

function createBlogBody(data) {
	var blogTitle = "<div class='blog-post'><h2 class='blog-post-title'>";
	blogTitle += data.title + "</h2>";
	var blogTime = "<p class='blog-post-meta'>";
	blogTime += data.createTimeLabel;
	blogTime += " by <a href='#'>";
	blogTime += data.username;
	blogTime += "</a></p>";
	var article = "<p>" + util.formatArticle(data.article);
	if (data.longArticle) {
		article += " <a onclick='getArticle(" + data.id + ")'>阅读全文</a>";
	} else if (data.detailArticle) {
		article += " <a onclick='getArticles()'>返回</a>";
	}
	article += "</p></div>";
	return blogTitle + blogTime + article;
}

function pause() {
	var css = musicButton.className;
	if (css.indexOf("play") >= 0) {
		musicButton.className = "glyphicon glyphicon-pause";
		musicPlayer.pause();
	} else {
		musicButton.className = "glyphicon glyphicon-play";
		musicPlayer.play();
	}
}

musicChecker();

function musicChecker() {
	if (musicPlayer.played && !isNaN(musicPlayer.duration)) {
		var duration = parseInt(musicPlayer.duration);
		var durationMinute = parseInt(duration / 60);
		var durationSecond = duration - durationMinute * 60;
		var currentTime = parseInt(musicPlayer.currentTime);
		var currentMinute = parseInt(currentTime / 60);
		var currentSecond = currentTime - currentMinute * 60;
		var timeLabel = getFormatTime(currentMinute) + ":" + getFormatTime(currentSecond)
				+ " - " + getFormatTime(durationMinute) + ":" + getFormatTime(durationSecond);
		musicTime.innerHTML = timeLabel;
	}
	setTimeout(musicChecker, 1000);
}

function getFormatTime(time) {
	return time < 10 ? ("0" + time) : time;
}
