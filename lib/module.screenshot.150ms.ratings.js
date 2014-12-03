var Module = require("./module.js").Module;
var selfExt = require("sdk/self");
const moduleFolder = "module.screenshot.150ms.ratings/";

var _questionObj = {
	question : "_default question",
	saveName : "_default.save.name",
	apUXWebsMinLabel : "_defaultMinLabel",
	apUXWebsMaxLabel : "_defaultMaxLabel"
};

// TODO redo this hack
const testScreenshots = [{
	fname : "test1.png",
	url : selfExt.data.url("resources/screenshots_short_test/test1.png")
}, {
	fname : "test2.png",
	url : selfExt.data.url("resources/screenshots_short_test/test2.png")
}, {
	fname : "test3.png",
	url : selfExt.data.url("resources/screenshots_short_test/test3.png")
}];

var Screenshot150msRatingModule = function(props, _questionObj, screenshots) {
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", moduleFolder + "screenshot.150ms.ratings.client.js"],
		moduleName : "Screenshot.150ms.Rating.module",
		outputToWriteInto : {
			"screensh.ratings.time" : _questionObj.saveName
		},
		moduleData : {
			url : moduleFolder + "screenshot.150ms.ratings.index.html",
			isPinned : true
		},
		emitDone : function() {
		},
		moduleFolder : moduleFolder,
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["screensh.ratings.time"], dataObj);
			});
		},
		contentScriptOptions : {
			"time" : 150,
			'question' : _questionObj.question,
			"apUXWebsMinLabel" : _questionObj.apUXWebsMinLabel,
			"apUXWebsMaxLabel" : _questionObj.apUXWebsMaxLabel,
			"screenshotsToRate" : screenshots.map(function(el, i, arr) {
				return {
					fname : el.fname,
					url : el.fullpath
				};
			}),
			"testScreenshots" : testScreenshots
		},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

Screenshot150msRatingModule.prototype = Object.create(Module);

module.exports = {
	Screenshot150msRatingModule : Screenshot150msRatingModule
};

