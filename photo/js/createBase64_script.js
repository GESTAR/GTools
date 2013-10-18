/**
 * @author:Ge Xin
 * @description: The context script file of Plugin
 * @version 1.0.2
 *
 */
 (function(){
	 //create a connect listener form main to connect,in order to get img base64
	chrome.extension.onConnect.addListener(function (port) {
		console.assert(port.name == "gTools_photo_t");
		port.onMessage.addListener(function (msg) {
			if (msg.cmd.indexOf("getImageBase64")>=0) {
				var url = decodeURIComponent(msg.cmd.split('_gTools_photo_url_')[1]);
				var img = new Image();
				img.src = url;
				//create canvas should after the img is loaded,or else the base64 is empty,because img.width is zero
				img.onload = function(){
					var canvas = document.createElement("canvas");
					canvas.width=img.width;
					canvas.height=img.height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);
					var data = '',_success=true;
					try{
						data = canvas.toDataURL();
					}catch(e){
						_success = false;
					}
					
					console.log(data)
					port.postMessage({
						success	: _success,
						imageBase64 : data
					});
				}
			};
		});
	});
 })();
