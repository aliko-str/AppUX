var Module = require("./module.js").Module;

var _questionObj = {
	question : "_default question",
	saveName : "_default.save.name",
	apUXWebsMinLabel : "_defaultMinLabel",
	apUXWebsMaxLabel : "_defaultMaxLabel"
};

var Screenshot4sRatingModule = function(props, _questionObj, screenshots) {
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.screenshot.4s.ratings/screenshot.4s.ratings.client.js"],
		moduleName : "Screenshot.4s.Rating.module",
		outputToWriteInto : {
			"screensh.ratings.time" : _questionObj.saveName
		},
		moduleData : {
			url : "module.screenshot.4s.ratings/screenshot.4s.ratings.index.html",
			isPinned : true
		},
		emitDone : function() {
		},
		moduleFolder : "module.screenshot.4s.ratings/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["screensh.ratings.time"], dataObj);
			});
		},
		contentScriptOptions : {
			'question' : _questionObj.question,
			"apUXWebsMinLabel" : _questionObj.apUXWebsMinLabel,
			"apUXWebsMaxLabel" : _questionObj.apUXWebsMaxLabel,
			"screenshotsToRate" : screenshots.map(function(el, i, arr) {
				return {
					fname : el.fname,
					url : el.fullpath
				};
			})
		},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

Screenshot4sRatingModule.prototype = Object.create(Module);

module.exports = {
	Screenshot4sRatingModule : Screenshot4sRatingModule
};

