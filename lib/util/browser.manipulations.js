var wUtils = require("sdk/window/utils");
var {Cc, Ci} = require("chrome");

function setCssViewport(sizes) {
	var aWindow = wUtils.getMostRecentBrowserWindow();
	var domWindowUtils = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
	domWindowUtils.setCSSViewport(sizes.width, sizes.height);
	return;
}

function getBrowserInnerSize() {
	var aWindow = wUtils.getMostRecentBrowserWindow();
	return {
		width : aWindow.innerWidth,
		height : aWindow.innerHeight
	};
}

module.exports = {
	setCssViewport : setCssViewport,
	getBrowserInnerSize : getBrowserInnerSize
};

