var Tracker = require("./tracker.js").Tracker;
var urls = require("sdk/url");

var ClickTracker = function(props, moduleName, includePtrn, trackInDetailWebs, exclude) {
	//var outNameManager = constructOutpObj(trackInDetailWebs);
	var inits = {
		scriptsToLoad : ["trackers/clicks.client.js"],
		moduleName : moduleName,
		trackerName : "clicks.tracker",
		outputToWriteInto : null,
		include : includePtrn,
		onDeactivate : function(storage, console, self) {
		},
		moduleFolder : "trackers/",
		onAttach : function() {
			// no-op
		},
		contentScriptOptions : {},
		pageModOptions : {
			attachTo : ["top", "frame"],
			exclude : exclude || ""
		},
		websitesToTrack: trackInDetailWebs
	};
	//inits.outputToWriteInto = outNameManager.nameIndex;
	inits.onAttach = function(worker, storage, console, self){
			worker.port.on("intab.click", function() {
				if(worker.tab.url){
					var hostname = urls.URL(worker.tab.url).hostname;
					// check if in the list of accepted webRoots
					var outClickName = self._getOutpNameByHostname(hostname);
					if(outClickName){
						storage.addObj(self.opts.outputToWriteInto[outClickName], "click");
					}else{
						return console.log("CLICK on a third-party page occured");
					}
				}else{
					return console.log("CLICK in an empty-url tab occured.");
				}
				return;
			});
	};
	Tracker.call(this, props, inits);
	return this;
};

ClickTracker.prototype = Object.create(Tracker);

module.exports = {
	ClickTracker : ClickTracker
};
