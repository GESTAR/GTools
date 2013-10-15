function getDomain(url){
	if(url.indexOf('//')<=-1){
		console.log('请确定url以http开头');
		return '';
	}
	var urls_1 = url.split('//');
	var urls_2 = urls_1[1].split('/');
	return urls_2[0];
}
function genericOnClick(info, tab) {
	window.open(info.linkUrl);
}
function selectionOnClick(info, tab) {
	window.open('http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D' + info.selectionText);
}
function imageOnClick(info, tab) {
	console.log(info.srcUrl+','+info.pageUrl);
	if(getDomain(info.srcUrl)!=getDomain(info.pageUrl)){
		console.log('图片所在DOMAIN不是url domain');
		alert('不能编辑此图片');
		return;
	}
	chrome.tabs.executeScript(tab.id, {file: "photo/js/createBase64_script.js"});
	
	window.open('photo/photo.html');
	chrome.extension.onConnect.addListener(function (port) {
		console.assert(port.name == "gTools_photo");
		port.onMessage.addListener(function (msg) {
			if (msg.cmd == "getImageBase64") {
				var tPort = chrome.tabs.connect(tab.id,{
						name : "gTools_photo_t"
					});
				tPort.postMessage({
					cmd : "getImageBase64_gTools_photo_url_"+encodeURIComponent(info.srcUrl)
				});
				tPort.onMessage.addListener(function (msg) {
					port.postMessage(msg);
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
