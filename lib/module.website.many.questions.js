// TODO continue adapting the module to 3 questions instead of one


var Module = require("./module.js").Module;
var tabs = require("sdk/tabs");

var _websiteAspectObj = {
	id : "_defaultID_e.g.Usability",
	question : "_default question",
	saveName : "_default.save.name",
	apUXWebsMinLabel : "_defaultMinLabel",
	apUXWebsMaxLabel : "_defaultMaxLabel"
};

function _validateInput(_questionArr, websites){
	if(!websites || !websites.length){
		var err = new Error("the list of websites to study was absent or empty");
		console.error("doc2o", err);
		if(props.debug){
			throw err;
		}
	}
	if(!_questionArr || !_questionArr.length){
		var err = new Error("the list of questions to ask was absent or empty");
		console.error("3div9", err);
		if(props.debug){
			throw err;
		}		
	}
	return true;
}

function closeATab(hostname){
  for (var tab of tabs){
  	if(tab.url.indexOf(hostname) > -1){
  		tab.close();
  	}
  }
}

var WebsiteManyQuestionsModule = function(props, _questionToStartFrom, _questionArr, websites, task) {
	var browsingTracker, clickingTracker;
	var _onReadySetTimeStartFunc;
	_validateInput(_questionArr, websites);
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/msg.display.js", "shared/util.js", "module.website.many.questions/website.many.questions.client.js"],
		moduleName : "Website.Many.Questions.module",
		outputToWriteInto : {
			"websratings" : "data.webs.multiple.question.ratings",
			"webstime" : "data.webs.task.time",
			"webstextansw" : "data.webs.task.answers"
		},
		moduleData : {
			url : "module.website.many.questions/website.many.questions.index.html",
			isPinned : true
		},
		emitDone : function() {
			!_onReadySetTimeStartFunc || tabs.removeListener("ready", _onReadySetTimeStartFunc);
			browsingTracker.deactivate();
			clickingTracker.deactivate();
		},
		moduleFolder : "module.website.many.questions/",
		onAttach : function(worker, storage, console, self) {
			var _timeStartStore = {};
			var _websOrderCounter = 0;
			var _currentWebsiteHostname;
			_onReadySetTimeStartFunc = function(tab){
				// the only reliable way to see when the user opened a website 
				// the past solution with a.onClick wasn't reliable due to many ways to open a link.
				if(_currentWebsiteHostname){
					if(tab.url.indexOf(_currentWebsiteHostname) > -1){
						_timeStartStore[_currentWebsiteHostname] = Date.now();
					}
				}else{
					if(props.debug){
						throw new Error("_currentWebsiteHostname is undefined -- the startTask event hasn't been triggered on the client side yet.");
					}
				}
			};
			tabs.on("ready", _onReadySetTimeStartFunc);
			browsingTracker.activate();
			clickingTracker.activate();
			worker.port.on("data.rating", function(dataObj) {
				worker.port.emit("msg.hide");
				return storage.addObj(self.opts.outputToWriteInto["websratings"], dataObj);
			});
			worker.port.on("startTask", function(dataObj){
				_currentWebsiteHostname = dataObj.hostname;
				// _timeStartStore[dataObj.hostname] = Date.now();
				return;
			});
			worker.port.on("endTask", function(dataObj){
				var timePerTask, order;
				if(_timeStartStore[dataObj.hostname] === undefined){
					console.log("Website '" + dataObj.hostname + "' was rated without visiting");
					timePerTask = 0; 
				}else{
					timePerTask = Date.now() - _timeStartStore[dataObj.hostname];
				}
				order = ++_websOrderCounter;
				storage.addObj(self.opts.outputToWriteInto["webstime"], {
					"webRoot": dataObj.hostname,
					"timePerTask": timePerTask,
					"order" : order
				});
				closeATab(dataObj.hostname);
				worker.port.emit("msg.show", "Please note that we've closed all browser tabs related to '" + dataObj.hostname + "'. This is required by our procedure.");
				// close tabs and notify
				return;
			});
			worker.port.on("data.task.answer", function(dataObj){
				return storage.addObj(self.opts.outputToWriteInto["webstextansw"], dataObj);
			});
		},
		contentScriptOptions : {
			"firstQuestion" : {
				"id" : _questionToStartFrom.id,
				'question' : _questionToStartFrom.question,
				"apUXWebsMinLabel" : _questionToStartFrom.apUXWebsMinLabel,
				"apUXWebsMaxLabel" : _questionToStartFrom.apUXWebsMaxLabel,
			},
			"otherQuestions" : _questionArr.map(function(el, i, arr){
				return {
					"id" : el.id,
					"question" : el.question,
					"apUXWebsMinLabel" : el.apUXWebsMinLabel,
					"apUXWebsMaxLabel" : el.apUXWebsMaxLabel
				};
			}),
			"websitesToRate" : websites.map(function(el, i, arr) {
				return {
					hostname : el.webRoot,
					url : el.href
				};
			}),
			"task" : task
		},
		pageModOptions : {
			attachTo : "top"
		}
	};
	// custom initialization
	{
		browsingTracker = new (require("./tracker.visit.revisit.js").BrowsingTracker)(props, inits.moduleName, "*", websites);
		clickingTracker = new (require("./tracker.clicks.js").ClickTracker)(props, inits.moduleName, "*", websites);
	}
	Module.call(this, props, inits);
	return this;
};

WebsiteManyQuestionsModule.prototype = Object.create(Module);

module.exports = {
	WebsiteManyQuestionsModule : WebsiteManyQuestionsModule
};
