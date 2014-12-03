var Module = require("./module.js").Module;

var NextStepMessageModule = function(props, nextStepItem){
	var inits = {
		scriptsToLoad : ["shared/client.starter.js", "shared/on.close.warning.js", "module.next.step.message/next.step.client.js"],
		moduleName : "Next.Step.Message.module",
		outputToWriteInto : {
		},
		moduleData : {
			url : "module.next.step.message/next.step.index.html",
			isPinned : true
		},
		emitDone : function() {
			
		},
		moduleFolder : "module.next.step.message/",
		onAttach : function(worker, storage, console, self) {
			worker.port.emit("nextStepText", nextStepItem.text);
			worker.port.emit("nextStepTitle", nextStepItem.title);
			worker.port.on("data", function(dataObj){
				
			});
		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

NextStepMessageModule.prototype = Object.create(Module);  

module.exports = {
	NextStepMessageModule: NextStepMessageModule
};

