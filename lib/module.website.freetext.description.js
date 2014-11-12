var Module = require("./module.js").Module;

var WebsiteFreeTextDescriptionModule = function(props, website, task) {
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.website.free.text.description/website.free.text.description.client.js"],
		moduleName : "Website.Free.Text.Description.Module",
		outputToWriteInto : {
			"websdescription" : task.saveName
		},
		moduleData : {
			url : "module.website.free.text.description/website.free.text.description.index.html",
			isPinned : true
		},
		emitDone : function() {
		},
		moduleFolder : "module.website.free.text.description/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["websdescription"], dataObj);
			});
			return;
		},
		contentScriptOptions : {
			"website" : {
				"hostname" : website.webRoot,
				"href" : website.href
			},
			"task" : task,
		},
		pageModOptions : {
		}
	};
	Module.call(this, props, inits);
	return this;
};

WebsiteFreeTextDescriptionModule.prototype = Object.create(Module);

module.exports = {
	WebsiteFreeTextDescriptionModule : WebsiteFreeTextDescriptionModule
};

