var _initLog = function(ifErr, str, moduleName, errCode) {
	var t = new Date().toString();
	errCode = errCode || "  --  ";
	var logMess = t + "\t" + errCode + "\t" + moduleName + "\t" + str + "\n";
	if(!ifErr) {
		console.log(logMess);
	} else {
		console.error(logMess);
	}
	return logMess;
};

var _log = _initLog;

var Console = function(sessionId, moduleName) {
	moduleName = moduleName || "";
	sessionId = sessionId.toString();
	var ss = require("./storage.js").getStorage(sessionId);
	// ss = ss.getStorage(sessionId);
	var infoLog = ss.registerOutput("infoLog");
	var errorLog = ss.registerOutput("errorLog");
	_log = function(ifErr, str, errCode) {
		var logMess = _initLog(ifErr, str, moduleName, errCode);
		infoLog.push(logMess);
		if(ifErr) {
			errorLog.push(logMess);
		}
		return logMess;
	};
	this.info = function(str) {
		return _log(false, str);
	};
	this.log = function(str) {
		return _log(false, str);
	};
	this.error = function(errCode, str) {
		_log(true, str, errCode);
		return {
			err : new Error(str)
		};
	};
	return this;
};

module.exports = {
	Console : Console,
	info : function(str) {
		_initLog(true, "The console wasn't initialized before use", "unknown module", "0r7fk");
		_initLog(false, str);
	},
	log : function(str) {
		_initLog(true, "The console wasn't initialized before use", "unknown module", "0r7fk");
		_initLog(false, str);
	},
	error : function(errCode, str) {
		_initLog(true, "The console wasn't initialized before use", "unknown module", "0r7fk");
		_initLog(false, str);
		return {
			err : new Error(str)
		};
	}
};
