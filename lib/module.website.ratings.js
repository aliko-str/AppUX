var Module = require("./module.js").Module;

var _websiteAspectObj = {
	question : "_default question",
	saveName : "_default.save.name",
	apUXWebsMinLabel : "_defaultMinLabel",
	apUXWebsMaxLabel : "_defaultMaxLabel"
};

var WebsiteRatingModule = function(props, _websiteAspectObj, websites) {
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.website.ratings/website.rating.client.js"],
		moduleName : "Website.Rating.module",
		outputToWriteInto : {
			"websratings" : ".data" + _websiteAspectObj.saveName
		},
		moduleData : {
			url : "module.website.ratings/website.rating.index.html",
			isPinned : true
		},
		emitDone : function() {

		},
		moduleFolder : "module.website.ratings/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["websratings"], dataObj);
			});
		},
		contentScriptOptions : {
			'question' : _websiteAspectObj.question,
			"apUXWebsMinLabel" : _websiteAspectObj.apUXWebsMinLabel,
			"apUXWebsMaxLabel" : _websiteAspectObj.apUXWebsMaxLabel,
			"websitesToRate" : websites.map(function(el, i, arr) {
				return {
					name : el.webRoot,
					url : el.href
				};
			})
		},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

WebsiteRatingModule.prototype = Object.create(Module);

module.exports = {
	WebsiteRatingModule : WebsiteRatingModule
};

