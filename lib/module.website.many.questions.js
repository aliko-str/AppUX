var Module = require("./module.js").Module;

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

var WebsiteManyQuestionsModule = function(props, _questionToStartFrom, _questionArr, websites, task) {
	var browsingTracker, clickingTracker;
	_validateInput(_questionArr, websites);
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.website.many.questions/website.many.questions.client.js"],
		moduleName : "Website.Many.Questions.module",
		outputToWriteInto : {
			"websratings" : "data.webs.multiple.question.ratings",
			"webstime" : "data.webs.task.time",
			"webstextansw" : "data.webs.task.answer"
		},
		moduleData : {
			url : "module.website.many.questions/website.many.questions.index.html",
			isPinned : true
		},
		emitDone : function() {
		},
		moduleFolder : "module.website.ratings/",
		onAttach : function(worker, storage, console, self) {
			var _timeStartStore = {};
			var _websOrder = {
				_counter: 0
			};
			worker.port.on("data.rating", function(dataObj) {
				return storage.addObj(self.opts.outputToWriteInto["websratings"], dataObj);
			});
			worker.port.on("startTask", function(dataObj){
				_websOrder[dataObj.hostname] = ++_websOrder._counter;
				_timeStartStore[dataObj.hostname] = Date.now();
				return;
			});
			worker.port.on("endTask", function(dataObj){
				var timePerTask, order;
				if(_timeStartStore[dataObj.hostname] === undefined){
					var err = new Error("A 'startTask' event hasn't been fired for this webRoot");
					console.error("luwy4", err);
					if(props.debug){
						throw err;
					}
					timePerTask = "errorHappened"; 
					order = "errorHappened";
				}else{
					timePerTask = Date.now() - _timeStartStore[dataObj.hostname];
					order = _websOrder[dataObj.hostname];
				}
				return storage.addObj(self.opts.outputToWriteInto["webstime"], {
					"webRoot": dataObj.hostname,
					"timePerTask": timePerTask,
					"order" : order
				});
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
		browsingTracker = new (require("./tracker.visit.revisit.js").BrowsingTracker)(props, inits.moduleName, "*", websites, "*" + inits.moduleData.url);
		clickingTracker = new (require("./tracker.clicks.js").ClickTracker)(props, inits.moduleName, "*", websites, "*" + inits.moduleData.url);
	}
	Module.call(this, props, inits);
	return this;
};

WebsiteManyQuestionsModule.prototype = Object.create(Module);

module.exports = {
	WebsiteManyQuestionsModule : WebsiteManyQuestionsModule
};

