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

// module.exports = {
	// init : function(props) {
		// //////////////////////// ADDITIONAL INITIALIZATION ///////////////////////////////
		// var scriptsToLoad = ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.demographics/demographics.js"];
		// var moduleName = "demographics";
		// var outputToWriteInto = {
			// "demographics" : moduleName + ".data"
		// };
		// var moduleData = {
			// url : self.data.url("module.demographics/demographics.html"),
			// isPinned : true
		// };
		// customeOnDestroyLogic = function(){
		// };
		// //---------------------- END ADDITIONAL INITIALIZATION //-------------------------
		// var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
		// var workers = [];
		// function detachWorker(worker, workerArray) {
		  // var index = workerArray.indexOf(worker);
		  // if(index != -1) {
		    // workerArray.splice(index, 1);
		  // }
		  // return;
		// }
		// var console = require("./console.js").Console(props.getProp("sessionId"), moduleName);
		// for(var i = 0, ilen = scriptsToLoad.length; i < ilen; i++) {
			// scriptsToLoad[i] = self.data.url(scriptsToLoad[i]);
		// }
		// for(var i = 0, _keys = Object.keys(outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
			// storage.registerOutput(outputToWriteInto[_keys[i]]);
		// }
		// // exports are below//
		// this.emitDone = function() {
			// for(var i = 0, ilen = workers.length; i < ilen; i++) {
				// workers[i].port.emit("done");
				// workers[i].destroy();
			// }
			// customeOnDestroyLogic();
			// return;
		// };
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
						// folder : "module.demographics/",
						// debug : props.getProp("debug")
					// },
					// ////////////// END CONFIGURE THESE PROPERTIES ////////////////
					// onAttach : function(worker) {
						// workers.push(worker);
				    // worker.on('detach', function () {
				      // detachWorker(this, workers);
				    // });
						// worker.port.emit("init", "Hi There!");
						// worker.port.on("error", function(err){
							// return console.error(err.errCode, err.str || err.toSource());
						// });
						// worker.port.on("next", function(){
							// return nextActivityCallback();
						// });
						// worker.port.on("message", function(message) {
							// return console.log(message);
						// });
						// ////////////// ADD CUSTOM LISTENERS ////////////////
						// worker.port.on("data", function(dataObj){
							// return storage.addObj(outputToWriteInto, dataObj);
						// });
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



