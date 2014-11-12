var ss = require("sdk/simple-storage");
var _debug = true;

function arrayToTableStr(arr, tableName){
	var result = "";
	if(arr && arr.length){
		if(typeof stringValue == "string"){
			if(!tableName){
				console.error("#5awyz tableName was undefined for an array of strings: using 'undefined'");
			}
			result = result + tableName + "\n";
			for(var i = 0, ilen = arr.length; i < ilen; i++){
				result += arr[i] + "\n";
			}
		}else{
			var tableNames = Object.keys(arr[0]);
			for(var j = 0, jlen = tableNames.length; j < jlen; j++){
				result += tableNames[j] + "\t";
			}
			result += "\n";
			for(var i = 0, ilen = arr.length; i < ilen; i++){
				for(var j = 0, jlen = tableNames.length; j < jlen; j++){
					result += arr[i][tableNames[j]] + "\t";
				}
				result += "\n";
			}			
		}
	}
	return result;
}

var _submitOnServer = function(fname, str) {
	//TODO implement submission
};

module.exports = {
	getStorage : function(sessionId) {
		var self = {};
		sessionId = sessionId.toString();
		if(!ss.storage[sessionId]) {
			ss.storage[sessionId] = {
				test : ["test1", "test2"]
			};
		}
		self.getObjArr = function(outpName){
			var _storage = ss.storage[sessionId];
			if(!_storage[outpName]) {
				var error = console.error("#tppkq compartment'" + outpName + "'  hasn't been registered.");
				if(_debug){
					throw new Error(error);
				}
			}
			return _storage[outpName];
		},
		self.addObj = function(outpName, obj) {
			var _storage = ss.storage[sessionId];
			if(!_storage[outpName]) {
				return console.error("#tppkq compartment'" + outpName + "'  hasn't been registered.");
			}
			if(_debug){
				console.log("[STORAGE] object saved to '" + outpName + "' obj: " + obj.toSource());
			}
			return _storage[outpName].push(obj);
		};
		self.registerOutput = function(outpName) {
			var _storage = ss.storage[sessionId];
			if(!_storage[outpName]) {
				_storage[outpName] = [];
			}
			return _storage[outpName];
		};
		self.submitOnServer = function() {
			var _storage = ss.storage[sessionId];
			for(var i = 0, _keys = Object.keys(_storage), ilen = _keys.length; i < ilen; i++) {
				var str = arrayToTableStr(_storage[_keys[i]], _keys[i]);
				_submitOnServer(_keys[i], str);
			}
			return;
		};
		return self;
	}
};
