var _hasBeenInitialized = false;
var _condition = 1;
var scrWidth = 1680, scrHeight = 939;
const googleExperienceDuration = 5 * 60;

const MAXCONDITION = (function() {
	var _screenshotBunchNum = require("./screenshots.js")._getNumOfStimuliBunches();
	var _websiteBunchNum = require("./websites.js")._getNumOfStimuliBunches();
	if(_screenshotBunchNum !== _websiteBunchNum) {
		console.error("#0t9h7 the number of screenshot butches doesn't match the number of website batches");
	}
	return Math.min(_websiteBunchNum, _screenshotBunchNum);
})();
var ALLIDS = (function(MAXCONDITION) {
	var i = 0, res = new Array(MAXCONDITION);
	while(++i <= MAXCONDITION) {
		res[i] = i;
	}
	return res;
})(MAXCONDITION);

module.exports = {
	getCondition : function() {
		if(!_hasBeenInitialized) {
			console.error("#fsf8o _settings hasn't been initalized -- return default conditionID");
			return _condition;
		}
		return _condition;
	},
	init : function(conditionId) {
		_condition = conditionId;
		_hasBeenInitialized = true;
	},
	validateId : function(id) {
		if( typeof id !== "number") {
			return "The Id has to be a number.";
		}
		if(id < 1 || id > MAXCONDITION) {
			return "The Id has to be between 1 and " + MAXCONDITION;
		}
		return false;
	},
	getGoogleSitesBunchId : function() {
		return ALLIDS[this.getCondition() - 1];
	},
	getNonGoogleSitesBunchId : function() {
		var result = ALLIDS.slice(0);
		result.splice(this.getCondition() - 1, 1);
		return result;
	},
	getGoogleExperienceDurationInSeconds : function() {
		return googleExperienceDuration;
	},
	getScreenSizes : function() {
		return {
			width : scrWidth,
			height : scrHeight
		};
	}
};
