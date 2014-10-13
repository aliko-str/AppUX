var ss = require("./storage.js");

var _initLog = function(ifErr, str, errCode) {
	var t = new Date().toString();
	errCode = errCode || "  --  ";
	var logMess = t + "\t" + errCode + "\t" + str + "\n";
	//infoLog.push(logMess);
	if(!ifErr) {
		console.log(t, errCode, str);
	} else {
		console.error(t, errCode, str);
		//errorLog.push(logMess);
	}
	return logMess;
};

var _log = _initLog;

module.exports = {
	init : function(sessionId) {
		sessionId = sessionId.toString();
		ss.init(sessionId);
		var infoLog = ss.registerOutput("infoLog");
		var errorLog = ss.registerOutput("errorLog");
		_log = function(ifErr, str, errCode) {
			var logMess = _initLog(ifErr, str, errCode);
			infoLog.push(logMess);
			if(ifErr) {
				errorLog.push(logMess);
			}
			return logMess;
		};
	},
	info : function(str) {
		_log("info", str);
	},
	log : function(str) {
		_log("info", str);
	},
	error : function(errCode, str) {
		_log("error", str, errCode);
	}
};
