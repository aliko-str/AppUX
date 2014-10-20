var pageWorker = require("sdk/page-worker");

module.exports = {
	preloadWebpages : function(webpages, callback) {
		var _loadingResult = [];
		var _semaphore = webpages.length;
		for(var i = 0, ilen = webpages.length; i < ilen; i++) {
			var url = webpages[i].href || webpages[i].url;
			_loadingResult[url] = "Not loaded";
			var worker = pageWorker.Page({
				contentURL : url,
				contentScript : "self.port.emit('loaded', 'loaded');",
				contentScriptWhen : "end"
			});
			worker.port.on("loaded", (function(worker) {
				return function(ev) {
					if(!_loadingResult[worker.contentURL].contains('Error')) {
						_loadingResult[worker.contentURL] = "Loaded";
					}
					worker.destroy();
					_semaphore--;
					if(!_semaphore) {
						callback(_loadingResult);
					}
				};
			})(worker));
			worker.port.on("error", (function(worker) {
				return function(err) {
					_loadingResult[worker.contentURL] = "Error" + err.toString();
				};
			})(worker));
			worker.on("error", (function(worker) {
				return function(err) {
					_loadingResult[worker.contentURL] = "Error" + err.toString();
				};
			})(worker));
		}
	},
	preloadImages : function(images) {
		throw new Error("Not Implemented");
	}
};
