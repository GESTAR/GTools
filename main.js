/**
 * @author:Ge Xin
 * @description: The main file of Plugin
 * @version 1.0.2
 *
 */
 (function(){
	var Main = {
		//==========================Global para
		GB : {
			tabGPre : null
		},
		//==========================init
		init : function(){
			this.action.link();
			this.action.selection();
			this.action.image();
		},
		//==========================对Chrome的一些初始化操作
		action : {
			link : function(){
				chrome.contextMenus.create({
					"title" : "新页面中打开",
					"contexts" : ["link"],
					"onclick" : Main.handler.genericOnClick
				});
			},
			selection : function(){
				chrome.contextMenus.create({
					"title" : "百度地图搜索 %s",
					"contexts" : ["selection"],
					"onclick" : Main.handler.selectionOnClick
				});
			},
			image : function(){
				chrome.contextMenus.create({
					"title" : "编辑图片",
					"contexts" : ["image"],
					"onclick" : Main.handler.imageOnClick
				});
			}
		},
		//==========================回调/触发
		handler : {
			//链接触发
			genericOnClick : function(info, tab){
				window.open(info.linkUrl);
			},
			//选中文字触发
			selectionOnClick : function(info, tab){
				window.open('http://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D' + info.selectionText);
			},
			//IMG触发
			imageOnClick : function(info, tabMain){
				var tab = null;
				function doExecuteScriptDone() {
					//connect img tab
					var tPort = chrome.tabs.connect(tab.id, {
							name : "gTools_photo_t"
						});
					tPort.postMessage({
						cmd : "getImageBase64_gTools_photo_url_" + encodeURIComponent(info.srcUrl)
					});
					tPort.onMessage.addListener(function (msgImg) {
						//remove img tab ,then send base64 to photo.html
						chrome.tabs.remove(tab.id);
						chrome.extension.onConnect.addListener(function (port) {
							console.assert(port.name == "gTools_photo");
							port.onMessage.addListener(function (msg) {
								if (msg.cmd == "getImageBase64") {
									console.log(msgImg)
									port.postMessage(msgImg);
								}
							});
						});
						//close the old img tab,and open one new
						if (Main.GB.tabGPre) {
							chrome.tabs.remove(Main.GB.tabGPre.id);
						}
						chrome.tabs.create({
							index : tabMain.index + 1,
							url : 'photo/photo.html'
						}, function (tab_GTools_Photo) {
							Main.GB.tabGPre = tab_GTools_Photo;
						});

					});
				}
				//create img tab
				chrome.tabs.create({
					index : tabMain.index + 1,
					url : info.srcUrl
				}, function (_tab) {
					tab = _tab;
					//tab中执行js文件，目的获取base64
					chrome.tabs.executeScript(tab.id, {
						file : "photo/js/createBase64_script.js"
					});
					setTimeout(function () {
						doExecuteScriptDone();
					}, 500);

				})
			}
		},
		//=========================工具
		tools : {
			//获取http domain
			getDomain : function(url){
				if (url.indexOf('//') <= -1) {
					console.log('请确定url以http开头');
					return '';
				}
				var urls_1 = url.split('//');
				var urls_2 = urls_1[1].split('/');
				return urls_2[0];
			}
		}
	}
	//*******************************************************
	window.addEventListener("DOMContentLoaded", function(){
        Main.init();
    }, false);
 })();
