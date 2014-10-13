var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var storage = require("./storage.js");
var console = require("./console.js");
var outputToWriteInto = "demographics"; 

module.exports = {
	init : function(props) {
		storage.init(props.getProp("sessionId"));
		storage.registerOutput(outputToWriteInto);
		console.init(props.getProp("sessionId"));
		var workers = [];
		function detachWorker(worker, workerArray) {
		  var index = workerArray.indexOf(worker);
		  if(index != -1) {
		    workerArray.splice(index, 1);
		  }
		  return;
		}
		return {
			emitDone : function(){
				for(var i = 0, ilen = workers.length; i < ilen; i++){
					workers[i].emit("done");
				}
				return;
			},
			createModule : function(nextActivityCallback) {
				var moduleData = {
					url : self.data.url("module.demographics/demographics.html"),
					isPinned : true
				};
				tabs.on("ready", function(tab) {
					if(tab.url == moduleData.url) {
						tab.on("close", function(tab) {
							if(!props.getProp("isTestDone")) {
								console.error("#530j3", "The main tab has been closed before the test end");
							}
						});
					}
				});
				var modulePageMode = pageMod.PageMod({
					include : moduleData.url,
					contentScriptFile : [self.data.url("shared/client.starter.js"), self.data.url("shared/on.close.warning.js")],
					contentScriptWhen : "ready",
					contentScriptOptions : {
						baseUrl : self.data.url(),
						folder : "module.demographics/",
						mainJsName : "demographics.js",
						debug : props.getProp("debug")
					},
					onAttach : function(worker) {
						workers.push(worker);
				    worker.on('detach', function () {
				      detachWorker(this, workers);
				    });
						worker.port.emit("init", "Hi There!");
						worker.port.on("injected", function(scriptName){
							return console.log("MODULE 'demographics'; script '" + scriptName + "' has been injected.");
						});
						worker.port.on("error", function(err){
							return console.error(err.errCode, err.str);
						});
						worker.port.on("next", function(){
							return nextActivityCallback();
						});
						worker.port.on("message", function(message) {
							// TODO replace the stub
							return console.log(message);
						});
						worker.port.on("data", function(dataObj){
							return storage.addObj(outputToWriteInto, dataObj);
						});
					}
				});
				modulePageMode.on("error", function(err) {
					return console.error("qr7i1", err.toString());
				});
				return moduleData;
			}
		};
	}
};

