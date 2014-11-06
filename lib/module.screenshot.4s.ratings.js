var Module = require("./module.js").Module;

var _questionObj = {
	question : "_default question",
	saveName : "_default.save.name",
	apUXWebsMinLabel : "_defaultMinLabel",
	apUXWebsMaxLabel : "_defaultMaxLabel"
};

var Screenshot4sRatingModule = function(props, _questionObj, screenshots) {
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.website.ratings/website.rating.client.js"],
		moduleName : "Website.Rating.module",
		outputToWriteInto : {
			"websratings" : ".data" + _questionObj.saveName
		},
		moduleData : {
			url : "module.website.ratings/website.rating.index.html",
			isPinned : true
		},
		emitDone : function() {
			allowFrameContentModifier.unregister();
			syncRoot = false;
		},
		moduleFolder : "module.website.ratings/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["websratings"], dataObj);
			});
		},
		contentScriptOptions : {
			'question' : _questionObj.question,
			"apUXWebsMinLabel" : _questionObj.apUXWebsMinLabel,
			"apUXWebsMaxLabel" : _questionObj.apUXWebsMaxLabel,
			"websitesToRate" : websites.map(function(el, i, arr) {
				return {
					hostname : el.webRoot,
					url : el.href
				};
			})
		},
		pageModOptions : {
			attachTo : "top"
		}
	};
	Module.call(this, props, inits);
	var _protoCreatePage = this.createPage;
	this.createPage = function(nextActivityCallback) {
		if(!syncRoot) {
			syncRoot = true;
			allowFrameContentModifier.register();
		}
		return _protoCreatePage.call(this, nextActivityCallback);
		;
	};
	return this;
};

Screenshot4sRatingModule.prototype = Object.create(Module);

module.exports = {
	Screenshot4sRatingModule : Screenshot4sRatingModule
};

