String.prototype.interpolate = function(o) {
	return this.replace(/<%([^<%>]*)%>/g, function(a, b) {
		var r = o[b];
		return typeof r === 'string' || typeof r === 'number' ? r : a;
	});
};

String.getNumberEndings = function(num) {
	if( typeof num !== 'number') {
		return "";
	}
	var ending;
	switch (num) {
		case 1:
			ending = "st";
			break;
		case 2:
			ending = "nd";
			break;
		case 3:
			ending = "rd";
			break;
		default:
			ending = "th";
			break;
	}
	return ending;
};

// Array.prototype.copy = function() {
// return this.slice(0);
// };

Array.prototype.shuffle = function() {
	var array = this;
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while(0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

Array.objToArray = function(obj) {
	var arr = [];
	for(var i in obj ) {
		if(obj.hasOwnProperty(i)) {
			arr.push(i);
		}
	}
	return arr;
};

if('function' !== typeof Array.prototype.reduce) {
	Array.prototype.reduce = function(callback, opt_initialValue) {
		'use strict';
		if(null === this || 'undefined' === typeof this) {
			// At the moment all modern browsers, that support strict mode, have
			// native implementation of Array.prototype.reduce. For instance, IE8
			// does not support strict mode, so this check is actually useless.
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if('function' !== typeof callback) {
			throw new TypeError(callback + ' is not a function');
		}
		var index, value, length = this.length >>> 0, isValueSet = false;
		if(1 < arguments.length) {
			value = opt_initialValue;
			isValueSet = true;
		}
		for( index = 0; length > index; ++index) {
			if(this.hasOwnProperty(index)) {
				if(isValueSet) {
					value = callback(value, this[index], index, this);
				} else {
					value = this[index];
					isValueSet = true;
				}
			}
		}
		if(!isValueSet) {
			throw new TypeError('Reduce of empty array with no initial value');
		}
		return value;
	};
}

if(!Object.keys) {
	Object.keys = function(obj) {
		var keys = [], k;
		for(k in obj) {
			if(Object.prototype.hasOwnProperty.call(obj, k)) {
				keys.push(k);
			}
		}
		return keys;
	};
}

function submitWithDelay(rootEl, callback) {
	var jqThisSubmit = $(rootEl).find("input[type='submit']");
	window.setTimeout((function(submText) {
		return function() {
			jqThisSubmit.val(submText);
			callback();
			return;
		};
	})(jqThisSubmit.val()), 500);
	jqThisSubmit.val("Saving it...");
	return;
}

function disableSubmitForNSec(jqSubmit, sec, btnText, clickCallback, unfreezeCallback, ifNoCounting) {
	var delaySec = sec || 5;
	var _secondsLeft = delaySec;
	var secondsToString = (function(delaySec) {
		if(delaySec > 60) {
			return function(sec) {
				var min = Math.floor(sec / 60);
				var _sec = sec % 60;
				return min + ":" + _sec + " min";
			};
		}
		return function(sec) {
			return sec + " sec";
		};
	})(delaySec);
	var strVal = btnText || "Submit is delayed ";
	var oldStrVal = jqSubmit.val();
	jqSubmit.val(strVal);
	//jqSubmit.attr("title", "You can't submit answers before the button unfreezes. This is a part of our anti-bot policy.");
	jqSubmit.attr("style", "box-shadow: none;cursor: not-allowed;opacity: 0.5;");
	jqSubmit.tooltip();
	jqSubmit.hover(function(ev) {
		ev.preventDefault();
	}, function(ev) {
		ev.preventDefault();
	});
	jqSubmit.click(function(ev) {
		var alertMsg = "Please spend a little more time doing the current activity. (At least " + secondsToString(_secondsLeft) + " more)";
		window.alert(alertMsg);
		ev.preventDefault();
	});
	function tick(secondLeft) {
		_secondsLeft = secondLeft;
		if(secondLeft) {
			if(!ifNoCounting){
				jqSubmit.val(strVal + secondsToString(secondLeft));
			}
			window.setTimeout(function() {
				tick(secondLeft - 1);
			}, 1000);
		} else {
			jqSubmit.val(oldStrVal);
			jqSubmit.removeAttr("style");
			jqSubmit.off("click");
			jqSubmit.off("hover");
			if(clickCallback) {
				jqSubmit.click(clickCallback);
			}
			jqSubmit.removeAttr("title");
			jqSubmit.removeAttr("data-original-title");
			jqSubmit.tooltip({
				disabled : true
			});
			unfreezeCallback();
		}
	};
	tick(delaySec);
};