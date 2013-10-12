chrome.extension.onConnect.addListener(function (port) {
	console.assert(port.name == "gTools_photo_t");
	port.onMessage.addListener(function (msg) {
		console.log(msg);
		if (msg.cmd.indexOf("getImageBase64")>=0) {
			var url = decodeURIComponent(msg.cmd.split('_')[1]);
			console.log(url);
			var img = new Image();
			img.src = url;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);
			var data = canvas.toDataURL();

			port.postMessage({
				imageBase64 : canvas.toDataURL()
			});
		}
	});
});