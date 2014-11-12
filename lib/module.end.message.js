var Module = require("./module.js").Module;

var EndMessageModule = function(props){
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "module.end.message/end.message.client.js"],
		moduleName : "End.message.module",
		outputToWriteInto : {
		},
		moduleData : {
			url : "module.end.message/end.message.index.html",
			isPinned : true
		},
		emitDone : function() {
	
		},
		moduleFolder : "module.end.message/",
		onAttach : function(worker, storage, console, self) {

		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	return this;
};

EndMessageModule.prototype = Object.create(Module);  

module.exports = {
	EndMessageModule: EndMessageModule
};

