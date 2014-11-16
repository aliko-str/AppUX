var Module = require("./module.js").Module;

var NextStepMessageModule = function(props, nextStepText){
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
			worker.port.emit("nextStepText", nextStepText);
			worker.port.on("data", function(dataObj){
				
			});
		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	// var _protoCreatePage = this.createPage;
	// this.createPage = function(_nextStepText, _toBeDesposedOnDone, nextActivityCallback){
		// nextStepText = _nextStepText;
		// if(typeof _toBeDesposedOnDone === "function"){
			// toBeDesposedOnDone = false;
			// nextActivityCallback = _toBeDesposedOnDone;
		// }else{
			// toBeDesposedOnDone = _toBeDesposedOnDone;
		// }
		// return _protoCreatePage.call(this, nextActivityCallback);
	// };
	return this;
};

NextStepMessageModule.prototype = Object.create(Module);  

module.exports = {
	NextStepMessageModule: NextStepMessageModule
};

