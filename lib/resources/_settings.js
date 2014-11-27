var _hasBeenInitialized = false;
var _condition = 1; // possible values: 1 to 3
var _isTelic = true; // possible values: true and false
var googleExperienceDuration = 5*60; // sec

var MAXCONDITION = 3;
var ALLIDS = [1,2,3];
if(!_isTelic){
	for(var i = 0, ilen = ALLIDS.length; i < ilen; i++){
		ALLIDS[i] += MAXCONDITION;
	}
}

module.exports = {
	getCondition: function(){
		if(!_hasBeenInitialized){
			console.error("#fsf8o _settings hasn't been initalized -- return default conditionID");
			return _condition;
		}
		return _condition;
	},
	init: function(conditionId){
		_condition = conditionId;
		_hasBeenInitialized = true;
	},
	validateId: function(id){
		if(typeof id !== "number"){
			return "The Id has to be a number.";
		}
		if(id < 1 || id > 60){
			return "The Id has to be between 1 and 60";
		}
		return false;
	},
	getGoogleSitesBunchId: function(){
		return ALLIDS[this.getCondition()-1];
	},
	getNonGoogleSitesBunchId: function(){
		var result = ALLIDS.slice(0);
		result.splice(this.getCondition()-1,1);
		return result;
	},
	getGoogleExperienceDurationInSeconds: function(){
		return googleExperienceDuration;
	}
};
