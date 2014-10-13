var ss = require("sdk/simple-storage");
var defaultSessionId = "-1";
var currSessionId = defaultSessionId;

function submitOnServer(fname, str) {
	//TODO implement submission
}

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

function getStorage() {
	if(currSessionId == defaultSessionId) {
		console.error("#dwvti storage is used before it is initialized");
	}
	return ss.storage[currSessionId];
}

module.exports = {
	init : function(sessionId) {
		sessionId = sessionId.toString();
		currSessionId = sessionId;
		if(!ss.storage[sessionId]) {
			ss.storage[sessionId] = {
				test : ["test1", "test2"]
			};
		}
		return(this);
	},
	addObj : function(outpName, obj) {
		var store = getStorage();
		if(!store[outpName]) {
			return console.error("#tppkq compartment'" + outpName + "'  hasn't been registered.");
		}
		return store[outpName].push(obj);
	},
	registerOutput : function(outpName) {
		var store = getStorage();
		if(!store[outpName]) {
			store[outpName] = [];
		}
		return store[outpName];
	},
	submitOnServer : function() {
		var store = getStorage();
		for(var i = 0, _keys = Object.keys(store), ilen = _keys.length; i < ilen; i++) {
			var str = arrayToTableStr(store[_keys[i]], _keys[i]);
			submitOnServer(_keys[i], str);
		}
		return;
	}
};
