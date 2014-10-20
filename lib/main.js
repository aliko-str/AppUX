var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var timer = require('sdk/timers');
var storage = require("./storage.js");
var console = require("./console.js");
var greetingModule = require("./module.greeting.message.js");
var demographicsModule = require("./module.demographics.js");
var googleModule = require("./module.google.experience.js");

var props = {
	isTestDone : false,
	sessionId : -1,
	debug: true,
	getProp: function(propName){
		return this[propName];
	}
};

var allModules = {};

function _init(){
	props.sessionId = Math.round(1000000 + Math.random() * 8999999);
	props.sessionId = props.sessionId.toString();
	storage.init(props.sessionId);
	console.init(props.sessionId);
	var resWebsites = require("./resources/websites.js");
	var resSettings = require("./resources/_settings.js");
	var googleWebsites = resWebsites.getWebsites(resSettings.getGoogleSitesBunchId());
	var resPreloader = require("./resource.preloader.js");
	resPreloader.preloadWebpages(googleWebsites, function(statuses){
		console.log("All webpages preloaded:");
		for(var i = 0, _keys = Object.keys(statuses), ilen = _keys.length; i < ilen; i++){
			console.log(_keys[i] + " : " + statuses[_keys[i]]);
		}
	});
	allModules["greetingModule"] = greetingModule.init(props);
	allModules["demographicsModule"] = demographicsModule.init(props);
	allModules["googleModule"] = googleModule.init(props, googleWebsites);
	var button = buttons.ActionButton({
		id : "mozilla-link",
		label : "Visit Mozilla",
		icon : {
			"16" : "./module.main/icon-16.png",
			"32" : "./module.main/icon-32.png",
			"64" : "./module.main/icon-64.png"
		},
		onClick : handleTestBeginning
	});
}

function handleTestBeginning(state) {
	var greetingModuleContent = allModules["greetingModule"].createModule(function(){
		var mainTab = tabs.activeTab;
		allModules["greetingModule"].emitDone();
		var demographicsModuleContent = allModules["demographicsModule"].createModule(function(){
			allModules["demographicsModule"].emitDone();
			var googleModuleContent = allModules["googleModule"].createModule(function(){
				//TODO continue from here
				return console.log("Hurray! We've reached the end of logic for now!");
			});
			googleModuleContent.navigateInTab(mainTab);
			// timer.setTimeout(function(){
				// mainTab.url = googleModuleContent.url;
				// return;
			// }, 100);
			return;
		});
		demographicsModuleContent.navigateInTab(mainTab);
		// timer.setTimeout(function(){
			// mainTab.url = demographicsModuleContent.url;
			// return;
		// }, 100);
		return;
	});
	greetingModuleContent.openInTab(tabs);
}

function handleFinish(state) {
	props.isTestDone = true;
	for(var i = 0, _keys = Object.keys(allModules), ilen = _keys.length; i < ilen; i++){
		allModules[_keys[i]].emitDone();
	}
	return storage.submitOnServer();
}

_init();
