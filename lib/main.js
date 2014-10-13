var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var storage = require("./storage.js");
var console = require("./console.js");
var greetingModule = require("./greeting.message.js");
var demographicsModule = require("./demographics.js");

var props = {
	isTestDone : false,
	sessionId : -1,
	debug: true,
	getProp: function(propName){
		return this[propName];
	}
};

var allModules = {};

var button = buttons.ActionButton({
	id : "mozilla-link",
	label : "Visit Mozilla",
	icon : {
		"16" : "./module.greeting.message/icon-16.png",
		"32" : "./module.greeting.message/icon-32.png",
		"64" : "./module.greeting.message/icon-64.png"
	},
	onClick : handleTestBeginning
});

function handleTestBeginning(state) {
	props.sessionId = Math.round(1000000 + Math.random() * 8999999);
	props.sessionId = props.sessionId.toString();
	storage.init(props.sessionId);
	console.init(props.sessionId);
	allModules["greetingModule"] = greetingModule.init(props);
	allModules["demographicsModule"] = demographicsModule.init(props);
	var greetingModuleContent = allModules["greetingModule"].createModule(function(){
		var demographicsModuleContent = allModules["demographicsModule"].createModule(function(){
			// TODO continue from here.
			return console.log("Hurray! We've reached the end of logic for now!");
		});
	});
	tabs.open(greetingModuleContent);
}

function handleFinish(state) {
	props.isTestDone = true;
	for(var i = 0, _keys = Object.keys(allModules), ilen = _keys.length; i < ilen; i++){
		allModules[_keys[i]].emitDone();
	}
	return storage.submitOnServer();
}


