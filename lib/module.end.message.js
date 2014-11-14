var Module = require("./module.js").Module;

var EndMessageModule = function(props) {
	var _sharedObj = {
		_isInited : false,
		init : function(storage, errorCallback, successCallback) {
			if(!this._isInited) {
				this._error = errorCallback;
				this._success = successCallback;
				this._storage = storage;
				this._isInited = true;
				if( typeof this._deterredAction === "function") {
					this._deterredAction();
					this._deterredAction = null;
				}
			}
			return;
		},
		_deterredAction : null,
		_error : function(err) {
			// no-op --> to be replaced
		},
		_success : function(msg) {
			// no-op --> to be replaced
		},
		_storage : null,
		saveAllExperimentalData : function() {
			var self = this;
			function saveActionWrapper() {
				self._storage.submitOnServer(false, function(result) {
					if(result.err) {
						self._error(result.err);
					} else {
						props.isTestDone = true;
						self._success(result.text);
					}
					return;
				});
			}
			if(self._isInited) {
				saveActionWrapper();
			} else {
				self._deterredAction = saveActionWrapper;
			}
			return;
		}
	};
	var inits = {
		scriptsToLoad : ["side.libs/jquery-2.0.3.min.js", "side.libs/jquery-ui-1.10.3.custom.min.js", "side.libs/jquery.ui.touch-punch.min.js", "side.libs/bootstrap.min.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-select.js", "side.libs/bootstrap-switch.js", "shared/client.starter.js", "shared/on.close.warning.js", "shared/util.js", "module.end.message/end.message.client.js"],
		moduleName : "End.message.module",
		outputToWriteInto : {
		},
		moduleData : {
			url : "module.end.message/end.message.index.html",
			isPinned : true
		},
		emitDone : function() {

		},
		moduleFolder : "module.end.message/",
		onAttach : function(worker, storage, console, self) {
			_sharedObj.init(storage, function(err) {
				return worker.port.emit("save.error", err);
			}, function(msg) {
				return worker.port.emit("save.success", msg);
			});
			worker.port.on("try.again", _sharedObj.saveAllExperimentalData);
		},
		contentScriptOptions : {},
		pageModOptions : {}
	};
	Module.call(this, props, inits);
	this.error = function(err) {
		_sharedObj.error(err);
	};
	this.success = function(msg) {
		_sharedObj.success(msg);
	};
	var _oldPageCreate = this.createPage;
	this.createPage = function(nextActivityCallback) {
		var page = _oldPageCreate(nextActivityCallback);
		page.saveAllExperimentalData = _sharedObj.saveAllExperimentalData;
		return page;
	};
	return this;
};

EndMessageModule.prototype = Object.create(Module);

module.exports = {
	EndMessageModule : EndMessageModule
};

