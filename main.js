function genericOnClick(info, tab) {
	window.open(info.linkUrl);
}
function selectionOnClick(info, tab) {
	console.log(info);
	console.log(tab)
	window.open('http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D' + info.selectionText);
}
function imageOnClick(info, tab) {
	chrome.tabs.executeScript(tab.id, {file: "photo/js/createBase64_script.js"});
	
	window.open('photo/photo.html');
	chrome.extension.onConnect.addListener(function (port) {
		console.assert(port.name == "gTools_photo");
		port.onMessage.addListener(function (msg) {
			console.log(msg);
			if (msg.cmd == "getImageBase64") {
				var tPort = chrome.tabs.connect(tab.id,{
						name : "gTools_photo_t"
					});
				tPort.postMessage({
					cmd : "getImageBase64_"+encodeURIComponent(info.srcUrl)
				});
				tPort.onMessage.addListener(function (msg) {
					console.log(msg);
					port.postMessage({
						imageBase64 : msg.imageBase64
					});
				});
			}
		});
	});
}
var link = chrome.contextMenus.create({
		"title" : "新页面中打开",
		"contexts" : ["link"],
		"onclick" : genericOnClick
	});
var selection = chrome.contextMenus.create({
		"title" : "百度地图搜索 %s",
		"contexts" : ["selection"],
		"onclick" : selectionOnClick
	});
var image = chrome.contextMenus.create({
		"title" : "编辑图片",
		"contexts" : ["image"],
		"onclick" : imageOnClick
	});
