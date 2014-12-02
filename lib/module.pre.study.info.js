const PanelFolder = "panel.pre.study.info/";
var selfExt = require("sdk/self");
var mergeFunc = require("sdk/util/object").merge;

var PreStudyInfoPanel = function(props, dataValidator) {
	var experimentalCondition;
	var opts = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/util.js", PanelFolder + "pre.study.client.js"],
		PanelName : "Pre.Study.Question.Panel",
		outputToWriteInto : {
			experimentalCondition : "experimental.condition.id"
		},
		PanelData : {
			url : PanelFolder + "pre.study.index.html"
		},
		PanelFolder : PanelFolder,
		contentScriptOptions : {
		},
		pageModOptions : {
			attachTo : "top"
		}
	};
	// options validation
	this.opts = mergeFunc({}, opts);
	//this.opts = opts;
	if(!opts.PanelName) {
		throw new Error("#5ytsd Missing initializaton info: a Panel shall have a name.");
	}
	this.opts.outputToWriteInto = {};
	for(var i = 0, _keys = Object.keys(opts.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
		this.opts.outputToWriteInto[_keys[i]] = this.opts.PanelName + "." + opts.outputToWriteInto[_keys[i]];
	}
	// data to open the Panel in a tab
	if(!this.opts.PanelData || !this.opts.PanelData.url) {
		throw new Error("#bnil7 Missing initalization info: a Panel shall be associated with a url to open.");
	}
	this.opts.PanelData.url = selfExt.data.url(this.opts.PanelData.url);
	// End options validation
	var storage = require("./storage.js").getStorage(props.getProp("sessionId"));
	var console = new (require("./console.js").Console)(props.getProp("sessionId"), this.opts.PanelName);
	for(var i = 0, ilen = this.opts.scriptsToLoad.length; i < ilen; i++) {
		this.opts.scriptsToLoad[i] = selfExt.data.url(this.opts.scriptsToLoad[i]);
	}
	for(var i = 0, _keys = Object.keys(this.opts.outputToWriteInto), ilen = _keys.length; i < ilen; i++) {
		storage.registerOutput(this.opts.outputToWriteInto[_keys[i]]);
	}
	this.createPanel = function(callback) {
		var self = this;
		var panel = require("sdk/panel").Panel({
			width : 400,
			height : 400,
			contentScriptFile : this.opts.scriptsToLoad,
			focus : true,
			contentScriptWhen : "ready",
			contentScriptOptions : {
				baseUrl : selfExt.data.url(),
				folder : this.opts.PanelFolder,
				debug : props.getProp("debug")
			},
			contentURL : this.opts.PanelData.url
		});
		panel.port.on("data", function(data) {
			var errorMessage = dataValidator(data);
			if(!errorMessage){
				experimentalCondition = data;
				storage.addObj(self.opts.outputToWriteInto["experimentalCondition"], data);
				panel.port.emit("success.data");
			}else{
				panel.port.emit("error.data", errorMessage);
			}
			return;
		});
		panel.port.on("next", function() {
			panel.destroy();
			callback();
			return;
		});
		panel.port.on("error", function(err) {
			return console.error("7uoa9", err.toString());
		});
		panel.show();
	};
	this.getExperimentalCondition = function() {
		return experimentalCondition;
	};
	return this;
};

module.exports = {
	PreStudyInfoPanel : PreStudyInfoPanel
};

