var Module = require("./module.js").Module;
var DemographicModule = function(props){
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.demographics/demographics.js"],
		moduleName : "demographics",
		outputToWriteInto : {
			"demographics" : ".data"
		},
		moduleData : {
			url : "module.demographics/demographics.html",
			isPinned : true
		},
		emitDone : function() {
	
		},
		moduleFolder : "module.demographics/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj){
				return storage.addObj(self.opts.outputToWriteInto["demographics"], dataObj);
			});
		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

DemographicModule.prototype = Object.create(Module);  

module.exports = {
	DemographicModule: DemographicModule
};


