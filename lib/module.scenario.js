var Module = require("./module.js").Module;

var ScenarioModule = function(props){
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.scenario/scenario.client.js"],
		moduleName : "Scenario.module",
		outputToWriteInto : {
		},
		moduleData : {
			url : "module.scenario/scenario.index.html",
			isPinned : true
		},
		emitDone : function() {
	
		},
		moduleFolder : "module.greeting.message/",
		onAttach : function(worker, storage, console, self) {
			worker.port.on("data", function(dataObj){
				return storage.addObj(self.opts.outputToWriteInto, dataObj);
			});
		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

ScenarioModule.prototype = Object.create(Module);  

module.exports = {
	ScenarioModule: ScenarioModule
};

