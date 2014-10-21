var Module = require("./module.js").Module;
//var mergeFunc = require("sdk/util/object").merge;

var GreetingModule = function(props){
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.greeting.message/main.client.js"],
		moduleName : "Greeting.message.module",
		outputToWriteInto : {
		},
		moduleData : {
			url : "module.greeting.message/main.index.html",
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

GreetingModule.prototype = Object.create(Module);  

module.exports = {
	GreetingModule: GreetingModule
};



// 
// 
// var tabs = require("sdk/tabs");
// var pageMod = require("sdk/page-mod");
// var self = require("sdk/self");
// var timer = require('sdk/timers');
// //var console = require("./console.js");
// 
// ////////////// CUSTOMIZE SCRIPTS TO LOAD ////////////////
// var scriptsToLoad = ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.greeting.message/main.client.js"];
// var moduleData = {
	// url : self.data.url("module.greeting.message/main.index.html"),
	// isPinned : true
// };
// ////////////// END CUSTOMIZE SCRIPTS TO LOAD ////////////////
// var workers = [];
// function emitDone() {
	// for(var i = 0, ilen = workers.length; i < ilen; i++) {
		// workers[i].port.emit("done");
	// }
	// return;
// }
// 
// function detachWorker(worker, workerArray) {
	// var index = workerArray.indexOf(worker);
	// if(index != -1) {
		// workerArray.splice(index, 1);
	// }
	// return;
// }
// 
// (function _init() {
	// for(var i = 0, ilen = scriptsToLoad.length; i < ilen; i++) {
		// scriptsToLoad[i] = self.data.url(scriptsToLoad[i]);
	// }
// })();
// 
// module.exports = {
	// init : function(props) {
		// var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
		// var console = new (require("./console.js").Console)(props.getProp("sessionId"), "Greeting.message.module");
		// return {
			// emitDone : emitDone,
			// createModule : function(nextActivityCallback) {
				// tabs.on("ready", function(tab) {
					// if(tab.url == moduleData.url) {
						// tab.on("close", function(tab) {
							// if(!props.getProp("isTestDone")) {
								// console.error("#530j3", "The main tab has been closed before the test end");
							// }
						// });
					// }
				// });
				// var modulePageMode = pageMod.PageMod({
					// //////////////  CONFIGURE THESE PROPERTIES ////////////////
					// include : moduleData.url,
					// contentScriptFile : scriptsToLoad,
					// contentScriptWhen : "ready",
					// contentScriptOptions : {
						// baseUrl : self.data.url(),
						// folder : "module.greeting.message/",
						// debug : props.getProp("debug")
					// },
					// ////////////// END CONFIGURE THESE PROPERTIES ////////////////
					// onAttach : function(worker) {
						// workers.push(worker);
						// worker.on('detach', function() {
							// detachWorker(this, workers);
						// });
						// worker.port.emit("init", "Hi There!");
						// worker.port.on("error", function(err) {
							// return console.error(err.errCode, err.str || err.toSource());
						// });
						// worker.port.on("next", function() {
							// return nextActivityCallback();
						// });
						// worker.port.on("message", function(message) {
							// return console.log(message);
						// });
						// ////////////// ADD CUSTOM LISTENERS ////////////////
						// // TODO Add custom logic
						// ////////////// END ADD CUSTOM LISTENERS ////////////////
					// }
				// });
				// modulePageMode.on("error", function(err) {
					// return console.error("qr7i1", err.toString());
				// });
				// return {
					// openInTab: function(tabs){
						// tabs.open(moduleData);
					// },
					// navigateInTab: function(tab){
						// timer.setTimeout(function(){
							// tab.url = moduleData.url;
							// return;
						// }, 100);
					// }
				// };
			// }
		// };
	// }
// };

