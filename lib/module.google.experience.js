var Module = require("./module.js").Module;

var GoogleModule = function(props, websitesToStudy) {
	var backButtonTracker = new (require("./tracker.visit.revisit.js").BrowsingTracker)(props, "*");
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui.min.js", "side.libs/bootstrap.min.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.google.experience/website.google.data.js", "module.google.experience/google.experience.client.js"],
		moduleName : "google.experience",
		outputToWriteInto : {
			"data.rearrWebs" : ".data.rearrWebs",
			"data.initWebs" : ".data.initWebs"
		},
		moduleData : {
			url : "module.google.experience/google.files/google.index.html",
			isPinned : true
		},
		emitDone : function() {
			if(backButtonTracker.deactivate) {
				backButtonTracker.deactivate();
			}
		},
		moduleFolder : "module.google.experience/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data.rearrWebs", function(data) {
				if(data && data.length) {
					for(var i = 0, ilen = data.length; i < ilen; i++) {
						storage.addObj(self.opts.outputToWriteInto["data.rearrWebs"], data[i]);
					}
				} else {
					console.error("j7suj", "the re-arranged list of websites is empty (google experience)");
				}
			});
			worker.port.on("data.initWebs", function(data) {
				if(data && data.length) {
					for(var i = 0, ilen = data.length; i < ilen; i++) {
						storage.addObj(self.opts.outputToWriteInto["data.initWebs"], data[i]);
					}
				} else {
					console.error("1v9ra", "the initial list of websites is empty (google experience)");
				}
			});
			// TODO Add custom logic
			backButtonTracker.activate();
		},
		contentScriptOptions : {
			websites : websitesToStudy
		},
		pageModOptions : {}
	};
	// google.experience specific initializatin
	{
		if(!websitesToStudy || !websitesToStudy.length) {
			var err = new Error("No websites to study were given.");
			console.error("hf4rp", err);
			throw err;
		}
	}
	Module.call(this, props, inits);
	return this;
};

GoogleModule.prototype = Object.create(Module.prototype);

module.exports = {
	GoogleModule : GoogleModule
};
