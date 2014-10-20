var _condition = 1; // possible values: 1 to 3
var _isTelic = true; // possible values: true and false

var MAXCONDITION = 3;
var ALLIDS = [1,2,3];
if(!_isTelic){
	for(var i = 0, ilen = ALLIDS.length; i < ilen; i++){
		ALLIDS[i] += MAXCONDITION;
	}
}

module.exports = {
	getGoogleSitesBunchId: function(){
		return ALLIDS[_condition-1];
	},
	getNonGoogleSitesBunchId: function(){
		var result = ALLIDS.slice(0);
		result.splice(_condition-1,1);
		return result;
	}
};
