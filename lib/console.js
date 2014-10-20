var ss = require("./storage.js");

var _initLog = function(ifErr, str, moduleName, errCode) {
	var t = new Date().toString();
	errCode = errCode || "  --  ";
	var logMess = t + "\t" + errCode + "\t" + moduleName + "\t" + str + "\n";
	//infoLog.push(logMess);
	if(!ifErr) {
		console.log(logMess);
	} else {
		console.error(logMess);
		//errorLog.push(logMess);
	}
	return logMess;
};

var _log = _initLog;

module.exports = {
	init : function(sessionId, moduleName) {
		moduleName = moduleName || "";
		sessionId = sessionId.toString();
		ss.init(sessionId);
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
	},
	info : function(str) {
		_log(false, str);
	},
	log : function(str) {
		_log(false, str);
	},
	error : function(errCode, str) {
		_log(true, str, errCode);
		return {
			err : new Error(str)
		};
	}
};
