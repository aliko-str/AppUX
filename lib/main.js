var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var timer = require('sdk/timers');
var GreetingModule = require("./module.greeting.message.js").GreetingModule;
var DemographicsModule = require("./module.demographics.js").DemographicModule;
var GoogleModule = require("./module.google.experience.js").GoogleModule;
var ScenarioModule = require("./module.scenario.js").ScenarioModule;
var NextStepMessageModule = require("./module.next.step.message.js").NextStepMessageModule;
//var WebsiteRatingModule =
// require("./module.website.ratings.js").WebsiteRatingModule;
var Screenshot4sRatingModule = require("./module.screenshot.4s.ratings.js").Screenshot4sRatingModule;
var EndMessageModule = require("./module.end.message.js").EndMessageModule;
var WebsiteManyQuestionModule = require("./module.website.many.questions.js").WebsiteManyQuestionsModule;
var WebsiteFreeTextDescriptionModule = require("./module.website.free.text.description.js").WebsiteFreeTextDescriptionModule;

var props = {
	isTestDone : false,
	sessionId : -1,
	debug : true,
	getProp : function(propName) {
		return this[propName];
	}
};

var allModules = {};

function _init() {
	props.sessionId = Math.round(1000000 + Math.random() * 8999999);
	props.sessionId = props.sessionId.toString();
	console = new (require("./console.js").Console)(props.getProp("sessionId"), "Main");
	var resSettings = require("./resources/_settings.js");
	var resQuestions = require("./resources/questions.js").init(props);
	var resTasks = require("./resources/tasks.js").init(props);
	var googleWebsites = require("./resources/websites.js").getWebsites(resSettings.getGoogleSitesBunchId());
	var googleScreenshots = require("./resources/screenshots.js").getScreenshotObjs(resSettings.getGoogleSitesBunchId());
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
	allModules["scenarioModule"] = new ScenarioModule(props);
	allModules["nextStepModule"] = new NextStepMessageModule(props);
	allModules["manyQuestionsModule"] = new WebsiteManyQuestionModule(props, resQuestions.getQuestions("company.favorability"), resQuestions.getQuestions(["website.content", "website.usability", "website.aesthetics"]), googleWebsites, resTasks.getTasks("find.contacts"));
	//allModules["rateWebsAestheticsModule"] = new WebsiteRatingModule(props,
	// resQuestions["website.aesthetics"], googleWebsites);
	//allModules["rateCompanyEmplModule"] = new WebsiteRatingModule(props,
	// resQuestions["company.image.as.employer"], googleWebsites);
	allModules["rate4sAesthetics"] = new Screenshot4sRatingModule(props, resQuestions.getQuestions("webpage.aesthetics"), googleScreenshots);
	allModules["endMessage"] = new EndMessageModule(props, function onDataSave() {
		require("./storage.js").getStorage(props.sessionId).submitOnServer(false, function(result) {
			if(result.err) {
				allModules["endMessage"].error(result.err);
			} else {
				props.isTestDone = true;
				allModules["endMessage"].success(result.text);
			}
			return;
		});
	});
	var button = buttons.ActionButton({
		id : "mozilla-link",
		label : "Begin User Experience Activities",
		icon : {
			"16" : "./module.main/icon-16.png",
			"32" : "./module.main/icon-32.png",
			"64" : "./module.main/icon-64.png"
		},
		onClick : handleTestBeginning
	});
}

function handleTestBeginning(state) {
	var _onCloseEmergencySave = (function(counter) {
		return function() {
			if(++counter < 3) {
				if(!props.isTestDone) {
					require("./storage.js").getStorage(props.sessionId).submitOnServer(true, function(result) {
						if(result.err) {
							timer.setTimeout(_onCloseEmergencySave, 1 * 60 * 1000);
						}
						return;
					});
				}
			}
			return;
		};
	})(0);
	allModules["greetingModule"].createPage(function() {
		var mainTab = tabs.activeTab;
		mainTab.on("close", function(tab) {
			if(!props.isTestDone) {
				require("./storage.js").getStorage(props.sessionId).submitOnServer(true, function(result) {
					// if error, try again - but only once
					if(result.err) {
						require("./storage.js").getStorage(props.sessionId).submitOnServer(true, function(result) {
							// no-op
						});
					}
					return;
				});
			}
		});
		allModules["demographicsModule"].createPage(function() {
			allModules["nextStepModule"].createPage("Rate (single) webpage aesthetics", function() {
				allModules["rate4sAesthetics"].createPage(function() {
					allModules["nextStepModule"].createPage("Read a scenario, visit websites, order the website list", function() {
						allModules["scenarioModule"].createPage(function() {
							allModules["googleModule"].createPage(function() {
								allModules["nextStepModule"].createPage("Search info on websites; Rate the websites and companies", function() {
									allModules["manyQuestionsModule"].createPage(function() {
										allModules["nextStepModule"].createPage("Last effort. Free-text website description.", function() {
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
													allModules["endMessage"].createPage(function() {
														mainTab.close(function() {
															return console.log("Hurray! We've finished!");
														});
														return;
													}).navigateInTab(mainTab).saveData();
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
}

_init();
