var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var timer = require('sdk/timers');
var GreetingModule = require("./module.greeting.message.js").GreetingModule;
var DemographicsModule = require("./module.demographics.js").DemographicModule;
var GoogleModule = require("./module.google.experience.js").GoogleModule;
var NextStepMessageModule = require("./module.next.step.message.js").NextStepMessageModule;
var Screenshot4sRatingModule = require("./module.screenshot.4s.ratings.js").Screenshot4sRatingModule;
var Screenshot150msRatingModule = require("./module.screenshot.150ms.ratings.js").Screenshot150msRatingModule;
var EndMessageModule = require("./module.end.message.js").EndMessageModule;
var WebsiteManyQuestionModule = require("./module.website.many.questions.js").WebsiteManyQuestionsModule;
var WebsiteFreeTextDescriptionModule = require("./module.website.freetext.description.js").WebsiteFreeTextDescriptionModule;
var PreStudyInfoModule = require("./module.pre.study.info.js").PreStudyInfoPanel;
var eventBroadcaster = require("./event.broadcaster.js");
var resSettings = require("./resources/_settings.js");
var browsUtil = require("./util/browser.manipulations.js");
var selfExt = require("sdk/self");

var props = {
	isTestInProcess : false,
	isTestDone : false,
	sessionId : -1,
	debug : false,
	getProp : function(propName) {
		return this[propName];
	}
};

var mainTab;
var allModules = {};

function _injectIconInMainTab(mainTab){
	var { viewFor } = require("sdk/view/core");
	var tab_utils = require("sdk/tabs/utils");
	var faviconUrl = selfExt.data.url("module.main/icon-16.png");
	mainTab.on("ready", function(tab){
	  var lowLevelTab = viewFor(tab);
	  var browser = tab_utils.getBrowserForTab(lowLevelTab);
	  var icon = browser.contentDocument.createElement("link");
		icon.setAttribute("rel", "shortcut icon");
		icon.setAttribute("href", faviconUrl);
	  browser.contentDocument.head.appendChild(icon);
	  return;
	});
	return;
}

function _runPreStudySteps(callback) {
	props.sessionId = Math.round(1000000 + Math.random() * 8999999);
	props.sessionId = props.sessionId.toString();
	var preStudyInfoModule = new PreStudyInfoModule(props, resSettings.validateId);
	preStudyInfoModule.createPanel(function() {
		resSettings.init(preStudyInfoModule.getExperimentalCondition());
		if(!props.debug) {
			browsUtil.setCssViewport(resSettings.getScreenSizes());
		}
		callback();
	});
	return;
}

function _init() {
	console = new (require("./console.js").Console)(props.getProp("sessionId"), "Main");
	var resQuestions = require("./resources/questions.js").init(props);
	var resTasks = require("./resources/tasks.js").init(props);
	var googleWebsites = require("./resources/websites.js").getWebsites(resSettings.getGoogleSitesBunchId());
	var screenshots4s = require("./resources/screenshots.js").getScreenshotObjs(resSettings.getGoogleSitesBunchId(), false);
	var screenshots150ms = require("./resources/screenshots.js").getScreenshotObjs(resSettings.getGoogleSitesBunchId(), true);
	var resSteps = require("./resources/step.descriptors.js").init(props, console);
	var resPreloader = require("./resource.preloader.js");
	if(!props.getProp("debug")) {
		resPreloader.preloadWebpages(googleWebsites, function(statuses) {
			console.log("All webpages preloaded:");
			for(var i = 0, _keys = Object.keys(statuses), ilen = _keys.length; i < ilen; i++) {
				console.log(_keys[i] + " : " + statuses[_keys[i]]);
			}
		});
	}
	allModules["greetingModule"] = new GreetingModule(props);
	allModules["demographicsModule"] = new DemographicsModule(props);
	allModules["googleModule"] = new GoogleModule(props, googleWebsites);
	allModules["nextStep0"] = new NextStepMessageModule(props, resSteps.getStep("webpage.aesthetics.150"));
	allModules["nextStep1"] = new NextStepMessageModule(props, resSteps.getStep("webpage.aesthetics.4"));
	allModules["nextStep2"] = new NextStepMessageModule(props, resSteps.getStep("google.experience"));
	allModules["nextStep3"] = new NextStepMessageModule(props, resSteps.getStep("tasks.and.ratings"));
	allModules["nextStep4"] = new NextStepMessageModule(props, resSteps.getStep("free.text.descriptions"));
	allModules["manyQuestionsModule"] = new WebsiteManyQuestionModule(props, resQuestions.getQuestions("company.favorability"), resQuestions.getQuestions(["website.content", "website.usability", "website.aesthetics"]), googleWebsites, resTasks.getTasks("find.contacts"));
	allModules["rate150msAesthetics"] = new Screenshot150msRatingModule(props, resQuestions.getQuestions("webpage.aesthetics"), screenshots150ms);
	allModules["rate4sAesthetics"] = new Screenshot4sRatingModule(props, resQuestions.getQuestions("webpage.aesthetics"), screenshots4s);
	allModules["endMessage"] = new EndMessageModule(props);
	return props;
}

function createRunButton() {
	var button = buttons.ActionButton({
		id : "mozilla-link",
		label : "Begin User Experience Activities",
		icon : {
			"16" : "./module.main/icon-16.png",
			"32" : "./module.main/icon-32.png",
			"64" : "./module.main/icon-64.png"
		},
		onClick : function(state) {
			if(!props.isTestInProcess) {
				_runPreStudySteps(function() {
					handleTestBeginning(state);
				});
			} else if(mainTab) {
				mainTab.activate();
			}
		}
	});
	return;
}

function attachGlobalEventHandlers(eventBroadcaster, allModules, mainTab) {
	eventBroadcaster.on("test.flow.interrupted", function() {
		if(props.debug) {
			console.log("test.flow.interrupted - be notified");
		}
		emergencyFlush(allModules, "endMessage", mainTab);
	});
	mainTab.on("close", getOnCloseEmergencySave());
	mainTab.on("close", function() {
		props.isTestInProcess = false;
		// clean-up here
		allModules = {};
	});
	return;
}

function getOnCloseEmergencySave() {
	var counter = 0;
	var _onCloseEmergencySave = function() {
		if(++counter < 3) {
			if(!props.isTestDone) {
				require("./storage.js").getStorage(props.sessionId).submitOnServer(true, function(result) {
					if(result.err) {
						timer.setTimeout(_onCloseEmergencySave, 1 * 60 * 1000);
					}
					return;
				});
			} else {
				if(props.debug) {
					console.log("There is no emergency - the test has been done.");
				}
			}
		}
		return;
	};
	return _onCloseEmergencySave;
}

function emergencyFlush(allModules, lastModuleName, mainTab) {
	for(var _keys = Object.keys(allModules), i = _keys.length; i--; ) {
		if(_keys[i] != lastModuleName) {
			allModules[_keys[i]].emitDone();
		}
	}
	return handelTestFinish(allModules[lastModuleName], mainTab, true);
}

function handelTestFinish(endModule, mainTab, isEmergency) {
	if(endModule) {
		var lastPage = endModule.createPage(function() {
			props.isTestDone = true;
			// we set timeout so the pageWorker is notified that the process has finished
			// successfully
			timer.setTimeout(function() {
				mainTab.close(function() {
					return console.log("Hurray! We've finished!");
				});
			}, 1 * 1000);
			return;
		});
		lastPage.navigateInTab(mainTab);
		lastPage.saveAllExperimentalData(isEmergency);
	} else {
		// the "close" event has already removed all modules
	}
	return;
}

function _closeAllTabsButPinnedAndTheMainTab(mainTab) {
	for (var tab of tabs){
		if(tab.id != mainTab.id && !tab.isPinned){
			tab.close();
		}
	}
}

function handleTestBeginning(state) {
	// only one test tab at a time is allowed.
	_init();
	props.isTestDone = false;
	props.isTestInProcess = true;
	allModules["greetingModule"].createPage(function() {
		mainTab = tabs.activeTab;
		attachGlobalEventHandlers(eventBroadcaster, allModules, mainTab);
		allModules["demographicsModule"].createPage(function() {
			allModules["nextStep0"].createPage(function() {
				allModules["rate150msAesthetics"].createPage(function() {
					allModules["nextStep1"].createPage(function() {
						allModules["rate4sAesthetics"].createPage(function() {
							allModules["nextStep2"].createPage(function() {
									allModules["googleModule"].createPage(function() {
										_closeAllTabsButPinnedAndTheMainTab(mainTab);
										allModules["nextStep3"].createPage(function() {
											allModules["manyQuestionsModule"].createPage(function() {
												_closeAllTabsButPinnedAndTheMainTab(mainTab);
												allModules["nextStep4"].createPage(function() {
													var resTasks = require("./resources/tasks.js").init(props);
													var reorderedWebsites = allModules["googleModule"].getReOrderedWebsiteList();
													var worstWebs, bestWebs, _websiteDescriptModuleNames;
													worstWebs = reorderedWebsites[reorderedWebsites.length - 1];
													bestWebs = reorderedWebsites[0];
													allModules["worstWebsiteDescriptors"] = new WebsiteFreeTextDescriptionModule(props, worstWebs, resTasks.getTasks("worst.website.free.description"));
													allModules["bestWebsiteDescriptors"] = new WebsiteFreeTextDescriptionModule(props, bestWebs, resTasks.getTasks("best.website.free.description"));
													if(Math.random() > 0.5) {
														_websiteDescriptModuleNames = ["worstWebsiteDescriptors", "bestWebsiteDescriptors"];
													} else {
														_websiteDescriptModuleNames = ["bestWebsiteDescriptors", "worstWebsiteDescriptors"];
													}
													allModules[_websiteDescriptModuleNames[0]].createPage(function() {
														allModules[_websiteDescriptModuleNames[1]].createPage(function() {
															return handelTestFinish(allModules["endMessage"], mainTab, false);
															// THE END OF LOGIC
														}).navigateInTab(mainTab);
														return;
													}).navigateInTab(mainTab);
													return;
												}).navigateInTab(mainTab);
												return;
											}).navigateInTab(mainTab);
											return;
										}).navigateInTab(mainTab);
									return;
								}).navigateInTab(mainTab);
								return;
							}).navigateInTab(mainTab);
							return;
						}).navigateInTab(mainTab);
						return;
					}).navigateInTab(mainTab);
					return;
				}).navigateInTab(mainTab);
				return;
			}).navigateInTab(mainTab);
			return;
		}).navigateInTab(mainTab);
		return;
	}).openInTab(tabs);
	mainTab = tabs.activeTab;
	_injectIconInMainTab(mainTab);
	return;
}

try {
	createRunButton();
} catch (e) {
	(getOnCloseEmergencySave())();
	if(props.debug) {
		throw e;
	}
	console.error(e);
}
