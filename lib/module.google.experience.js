var Module = require("./module.js").Module;
var selfExt = require("sdk/self");

var GoogleModule = function(props, websitesToStudy) {
	var minTimeToBrowse = 5 * 1; // seconds
	var browsingTracker, clickingTracker, lookingTimeTracker;
	var timestampExperienceStart;
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui.min.js", "side.libs/bootstrap.min.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.google.experience/website.google.data.js", "module.google.experience/google.experience.client.js"],
		moduleName : "google.experience",
		outputToWriteInto : {
			"data.rearrWebs" : "data.rearrWebs",
			"data.initWebs" : "data.initWebs",
			"data.time.whole.task" : "data.time.per.whole.google.experience"
		},
		moduleData : {
			url : "module.google.experience/google.files/google.index.html",
			isPinned : true
		},
		emitDone : function(storage, console, self) {
			storage.addObj(self.opts.outputToWriteInto["data.time.whole.task"], Date.now() - timestampExperienceStart);
			browsingTracker.deactivate();
			clickingTracker.deactivate();
			lookingTimeTracker.deactivate();
		},
		moduleFolder : "module.google.experience/",
		onAttach : function(worker, storage, console, self) {
			timestampExperienceStart = Date.now();
			worker.port.on("data.rearrWebs", function(data) {
				if(data && data.length) {
					for(var i = 0, ilen = data.length; i < ilen; i++) {
						storage.addObj(self.opts.outputToWriteInto["data.rearrWebs"], data[i]);
					}
				} else {
					console.error("j7suj", "the re-arranged list of websites is empty (google experience)");
				}
			});
			worker.port.on("data.initWebs", function(data) {
				if(data && data.length) {
					for(var i = 0, ilen = data.length; i < ilen; i++) {
						storage.addObj(self.opts.outputToWriteInto["data.initWebs"], data[i]);
					}
				} else {
					console.error("1v9ra", "the initial list of websites is empty (google experience)");
				}
			});
			// TODO Add custom logic
			browsingTracker.activate();
			clickingTracker.activate();
			lookingTimeTracker.activate();
		},
		contentScriptOptions : {
			websites : websitesToStudy,
			minTimeToBrowse : minTimeToBrowse
		},
		pageModOptions : {}
	};
	// google.experience specific initializatin
	{
		browsingTracker = new (require("./tracker.visit.revisit.js").BrowsingTracker)(props, inits.moduleName, "*", websitesToStudy);
		clickingTracker = new (require("./tracker.clicks.js").ClickTracker)(props, inits.moduleName, "*", websitesToStudy);
		var dontTrackThisModuleTab_url = selfExt.data.url(inits.moduleData.url);
		lookingTimeTracker = new (require("./tracker.looking.time.js").LookingTimeTracker)(props, inits.moduleName, websitesToStudy, dontTrackThisModuleTab_url);
		if(!websitesToStudy || !websitesToStudy.length) {
			var err = new Error("No websites to study were given.");
			console.error("hf4rp", err);
			throw err;
		}
	}
	Module.call(this, props, inits);
	this.getReOrderedWebsiteList = function(){
		var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
		var websList = storage.getObjArr(this.opts.outputToWriteInto["data.rearrWebs"]);
		if(websList && websList.length){
			websList = websList.sort(function(a, b){
				if(a.index < b.index){
					return -1;
				}
				if(a.index > b.index){
					return 1;
				}
				return 0;
			});
			var _copy = websList.map(function(val, i, arr){
				for(var i = websitesToStudy.length; i--; ){
					if(websitesToStudy[i].webRoot == val.webRoot){
						return websitesToStudy[i];
					}
					if(props.debug){
						throw new Error("#h7i01 a webRoot hasn't been found in websitesToStudy");
					}
					return null;
				}
			});
			websList = _copy;
		}else{
			// only possible in the production case - in debug, we will get an exception
			websList = websitesToStudy;
		}
		return websList;
	};
	return this;
};

GoogleModule.prototype = Object.create(Module.prototype);

module.exports = {
	GoogleModule : GoogleModule
};
