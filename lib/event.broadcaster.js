const { EventTarget } = require("sdk/event/target");
let { emit } = require('sdk/event/core');

var target = new EventTarget();
target.emit = function(eventName, eventData){
	emit(this, eventName, eventData);
};

module.exports = target;