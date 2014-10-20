var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var storage = require("./storage.js");
var console = require("./console.js");

////////////// CUSTOMIZE SCRIPTS TO LOAD + variables ////////////////
var scriptsToLoad = ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui.min.js", "side.libs/bootstrap.min.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.google.experience/website.google.data.js", "module.google.experience/google.experience.client.js"];
var websitesToStudy = require("./experimental.input/websites.js").getWebsites(require("./experimental.input/_settings.js").getGoogleSitesBunchId());
var moduleName = "google.experience";
var outputToWriteInto = {
	"data.rearrWebs" : moduleName + "data.rearrWebs",
	"data.initWebs": moduleName + "data.initWebs"
};
////////////// END CUSTOMIZE SCRIPTS TO LOAD + variables ////////////////
var workers = [];
function emitDone() {
	for(var i = 0, ilen = workers.length; i < ilen; i++) {
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
	for(var i = 0, ilen = scriptsToLoad.length; i < ilen; i++) {
		scriptsToLoad[i] = self.data.url(scriptsToLoad[i]);
	}
})();

module.exports = {
	init : function(props) {
		storage.init(props.getProp("sessionId"));
		console.init(props.getProp("sessionId"), moduleName);
		for(var i = 0, _keys = Object.keys(outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
			storage.registerOutput(outputToWriteInto[_keys[i]]);
		}
		return {
			emitDone : emitDone,
			createModule : function(nextActivityCallback) {
				////////////// IF THE MODULE TO BE A PAGE, CONFIGURE THESE PROPERTIES ////////////////
				var moduleData = {
					url : self.data.url("module.google.experience/google.files/google.index.html"),
					isPinned : true
				};
				////////////// END IF THE MODULE TO BE A PAGE, CONFIGURE THESE PROPERTIES: OTHERWISE DELETE ////////////////
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
					//////////////  CONFIGURE THESE PROPERTIES ////////////////
					include : moduleData.url,
					contentScriptFile : scriptsToLoad,
					contentScriptWhen : "ready",
					contentScriptOptions : {
						baseUrl : self.data.url(),
						folder : "module.google.experience/",
						debug : props.getProp("debug"),
						websites : websitesToStudy
					},
					////////////// END CONFIGURE THESE PROPERTIES ////////////////
					onAttach : function(worker) {
						workers.push(worker);
						worker.on('detach', function() {
							detachWorker(this, workers);
						});
						worker.port.emit("init", "Hi There!");
						worker.port.on("error", function(err) {
							return console.error(err.errCode, err.str || err.toSource());
						});
						worker.port.on("next", function() {
							return nextActivityCallback();
						});
						worker.port.on("message", function(message) {
							return console.log(message);
						});
						////////////// ADD CUSTOM LISTENERS ////////////////
						worker.port.on("data.rearrWebs", function(data) {
							if(data && data.length) {
								for(var i = 0, ilen = data.length; i < ilen; i++){
									storage.addObj(outputToWriteInto["data.rearrWebs"], data[i]);
								}
							} else {
								console.error("j7suj", "the re-arranged list of websites is empty (google experience)");
							}
						});
						worker.port.on("data.initWebs", function(data){
							if(data && data.length) {
								for(var i = 0, ilen = data.length; i < ilen; i++){
									storage.addObj(outputToWriteInto["data.initWebs"], data[i]);
								}
							} else {
								console.error("1v9ra", "the initial list of websites is empty (google experience)");
							}
						});
						// TODO Add custom logic
						////////////// END ADD CUSTOM LISTENERS ////////////////
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

