var Request = require("sdk/request").Request;
var ss = require("sdk/simple-storage");
var submitUrlBase, dataUrl, logUrl;
var _debug = true;
// if(_debug){
	// submitUrlBase = "http://127.0.0.1:8081";
// }else{
	submitUrlBase = "http://atw-lab.com";
// }
dataUrl = "/api/exp3.0/data/";
logUrl = "/api/exp3.0/logs/";

function arrayToTableStr(arr, tableName){
	var result = "";
	if(arr && arr.length){
		if(typeof arr[0] !== "object"){
			if(!tableName){
				tableName = "undefined";
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

var _submitOnServer = function(isUnfinished, sessionId, objToSubmit, logsToSubmit, callback) {
	// try to save experimental data first
	Request({
	  url: submitUrlBase + dataUrl + sessionId + "/?isUnfinished=" + isUnfinished.toString(),
	  contentType: "application/json",
	  content : JSON.stringify(objToSubmit),
	  onComplete: function (response) {
	  	if(_debug){
		  	console.log("Tried to save to: " + submitUrlBase + dataUrl + sessionId + "/?isUnfinished=" + isUnfinished.toString());
		  	console.log("Server replied: " + response.statusText + " Text::" + response.text);
	  	}
	    if(response.status < 300 && response.status >= 200){
	    	// if successful, try to save logs
	    	Request({
				  url: submitUrlBase + logUrl + sessionId + "/?isUnfinished=" + isUnfinished.toString(),
				  contentType: "application/json",
				  content : JSON.stringify(logsToSubmit),
				  onComplete: function (response) {
				  	if(_debug){
					  	console.log("Tried to save to: " + submitUrlBase + logUrl + sessionId + "/?isUnfinished=" + isUnfinished.toString());
					  	console.log("Server replied: " + response.statusText + " Text::" + response.text);
				  	}
				    if(response.status < 300 && response.status >= 200){
				    	callback({
				    		text: response.text
				    	});
				    }else{
				    	callback({
				    		err: response.text
				    	});
				    }
				    return;
				  }
				}).post();
	    }else{
	    	// if can't save experimental data, announce an error
	    	callback({
	    		err: response.text || "Couldn't reach the server..."
	    	});
	    }
	    return;
	  }
	}).post();
	return;
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
				if(_debug){
					console.log("#tppkq compartment'" + outpName + "'  hasn't been registered. Returning 'undefined'");
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
		self.registerOutput = function(outpName, isLogs) {
			var _storage = ss.storage[sessionId];
			if(!_storage[outpName]) {
				_storage[outpName] = [];
				_storage[outpName].isLogs = isLogs?true:false;
			}
			return _storage[outpName];
		};
		self.submitOnServer = function(isUnfinished, callback) {
			if(self.getObjArr("alreadySaved")){
				console.error("#9goew Attempting to save already saved content");
				return callback(self.getObjArr("alreadySaved")[0]);
			}
			var _storage = ss.storage[sessionId];
			var objToSubmit = {};
			var logsToSubmit = {};
			for(var i = 0, _keys = Object.keys(_storage), ilen = _keys.length; i < ilen; i++) {
				var str = arrayToTableStr(_storage[_keys[i]], _keys[i]);
				if(_storage[_keys[i]].isLogs){
					logsToSubmit[_keys[i]] = str;
				}else{
					objToSubmit[_keys[i]] = str;
				}
			}
			return _submitOnServer(isUnfinished, sessionId, objToSubmit, logsToSubmit, function(result){
				if(!result.err){
					self.registerOutput("alreadySaved", false);
					self.addObj("alreadySaved", result);
				}
				return callback(result);
			});
		};
		return self;
	}
};
