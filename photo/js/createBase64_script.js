chrome.extension.onConnect.addListener(function (port) {
	console.assert(port.name == "gTools_photo_t");
	port.onMessage.addListener(function (msg) {
		if (msg.cmd.indexOf("getImageBase64")>=0) {
			var url = decodeURIComponent(msg.cmd.split('_gTools_photo_url_')[1]);
			var img = new Image();
			img.src = url;
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

			port.postMessage({
				success	: _success,
				imageBase64 : data
			});
		}
	});
});