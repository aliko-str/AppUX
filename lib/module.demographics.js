var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var storage = require("./storage.js");
var console = require("./console.js");

////////////// CUSTOMIZE SCRIPTS TO LOAD ////////////////
var scriptsToLoad = ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "module.demographics/demographics.js"];
var outputToWriteInto = "demographics";
////////////// END CUSTOMIZE SCRIPTS TO LOAD ////////////////
var workers = [];
function emitDone(){
	for(var i = 0, ilen = workers.length; i < ilen; i++){
		workers[i].port.emit("done");
	}
	return;
}
function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
  return;
}

(function _init() {
	for(var i = 0, ilen = scriptsToLoad.length; i < ilen; i++){
		scriptsToLoad[i] = self.data.url(scriptsToLoad[i]);
	}
})();


module.exports = {
	init : function(props) {
		storage.init(props.getProp("sessionId"));
		storage.registerOutput(outputToWriteInto);
		console.init(props.getProp("sessionId"));
		return {
			emitDone : emitDone,
			createModule : function(nextActivityCallback) {
				////////////// IF THE MODULE TO BE A PAGE, CONFIGURE THESE PROPERTIES ////////////////
				var mainModuleData = {
					url : self.data.url("module.demographics/demographics.html"),
					isPinned : true
				};
				////////////// END IF THE MODULE TO BE A PAGE, CONFIGURE THESE PROPERTIES: OTHERWISE DELETE ////////////////
				tabs.on("ready", function(tab) {
					if(tab.url == mainModuleData.url) {
						tab.on("close", function(tab) {
							if(!props.getProp("isTestDone")) {
								console.error("#530j3", "The main tab has been closed before the test end");
							}
						});
					}
				});
				var modulePageMode = pageMod.PageMod({
					//////////////  CONFIGURE THESE PROPERTIES ////////////////
					include : mainModuleData.url,
					contentScriptFile : scriptsToLoad,
					contentScriptWhen : "ready",
					contentScriptOptions : {
						baseUrl : self.data.url(),
						folder : "module.demographics/",
						debug : props.getProp("debug")
					},
					////////////// END CONFIGURE THESE PROPERTIES ////////////////
					onAttach : function(worker) {
						workers.push(worker);
				    worker.on('detach', function () {
				      detachWorker(this, workers);
				    });
						worker.port.emit("init", "Hi There!");
						worker.port.on("error", function(err){
							return console.error(err.errCode, err.str || err.toSource());
						});
						worker.port.on("next", function(){
							return nextActivityCallback();
						});
						worker.port.on("message", function(message) {
							return console.log(message);
						});
						////////////// ADD CUSTOM LISTENERS ////////////////
						worker.port.on("data", function(dataObj){
							return storage.addObj(outputToWriteInto, dataObj);
						});
						////////////// END ADD CUSTOM LISTENERS ////////////////
					}
				});
				modulePageMode.on("error", function(err) {
					return console.error("qr7i1", err.toString());
				});
				return mainModuleData;
			}
		};
	}
};



