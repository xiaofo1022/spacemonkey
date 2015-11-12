/**
 * Publish Articles
 */
var titleInput = document.querySelector("#title");
var articleInput = document.querySelector("#article");
var labelInput = document.querySelector("#label");
var articleMap = {};
var articleList = document.querySelector("#article-list");
var labelList = document.querySelector("#label-list");
var selectedArticleId;

getLabels();

function getLabels() {
	util.doGet("label/getAllLabels", function(list) {
		if (list != null) {
			var listHtml = "";
			for (var i = 0; i < list.length; i++) {
				var data = list[i];
				listHtml += ("<a onclick='addLabel(\"" + data.name + "\")'>" + data.name + "</a>&nbsp;");
			}
			labelList.innerHTML = listHtml;
		}
	});
}

function addLabel(labelName) {
	labelInput.value = (labelInput.value + " " + labelName);
}

getArticles();

function getArticles() {
	$.ajax({
		type:"get",
		contentType:"application/json",
		dataType:"json",
		url:"articles/getArticles",
		success:function(list) {
			if (list != null) {
				var listHtml = "";
				for (var i = 0; i < list.length; i++) {
					var data = list[i];
					articleMap[data.id] = data;
					listHtml += "<li><li><a id='" + data.id + "' onclick='getArticle(" + data.id + ")'>" + data.title + "</a></li>";
				}
				articleList.innerHTML = listHtml;
			}
		},
		error:function(data) {
			console.log(data);
		}
	});
}

function getArticle(articleId) {
	util.doGet("articles/getArticle/" + articleId, function(data) {
		if (data != null) {
			selectedArticleId = data.id;
			titleInput.value = data.title;
			articleInput.value = data.article;
		}
	});
}

var btnSubmit = document.querySelector("#btnSubmit");
var btnSave = document.querySelector("#btnSave");
btnSubmit.onclick = function(e) {
	publishArticle();
};
btnSave.onclick = function(e) {
	publishArticle();
};

function publishArticle(isAutoSave) {
	var title = document.querySelector("#title").value;
	var article = document.querySelector("#article").value;
	var label = document.querySelector("#label").value;
	label = label.replace(/\s+/g, " ");
	if (title && article) {
		var data = {title:title, article:article, labelNames: label};
		if (selectedArticleId != undefined) {
			data.id = selectedArticleId;
		}
		$.ajax({
			type:"post",
			contentType:"application/json",
			dataType:"json",
			data:JSON.stringify(data),
			url:"articles/publish",
			success:function(data) {
				if (isAutoSave) {
					selectedArticleId = data;
				} else {
					location.assign("record");
				}
			},
			error:function(data) {
				console.log(data);
			}
		});
	}
}

var blogTitle = document.querySelector("#blog-title");
var blogBody = document.querySelector("#blog-body");
var btnPreview = document.querySelector("#btnPreview");
btnPreview.onclick = function(e) {
	var title = document.querySelector("#title").value;
	var article = document.querySelector("#article").value;
	blogTitle.innerHTML = title;
	blogBody.innerHTML = util.formatArticle(article);
};

var btnDelete = document.querySelector("#btnDelete");
btnDelete.onclick = function(e) {
	if (selectedArticleId) {
		var result = confirm("真的要删了吗");
		if (result) {
			deleteArticle();
		}
	}
};

function deleteArticle() {
	$.ajax({
		type:"post",
		contentType:"application/json",
		dataType:"json",
		url:"articles/deleteArticle/" + selectedArticleId,
		success:function(data) {
			location.reload(true);
		},
		error:function(data) {
			console.log(data);
		}
	});
}

var autoSaveTime = document.querySelector("#autoSaveTime");

autoSaveArticle();

function autoSaveArticle() {
	publishArticle(true);
	if (selectedArticleId) {
		var now = new Date();
		autoSaveTime.innerHTML = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " 时保存";
	}
	setTimeout(autoSaveArticle, 30000);
}