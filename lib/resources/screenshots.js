var self = require("sdk/self");
var basePath = "resources/screenshots/";

var _allScreenshots = {
	'bunch1' : ["www.cieloclub.com.png", "www.endclub.com.png", "www.fabriclondon.com.png", "www.fuse.be.fuse.png", "www.spaceibiza.com.png", "www.tenax.org.png", "www.week-end-berlin.de.png"],
	'bunch2' : ["www.barmusichall.com.png", "www.berghain.de.png", "www.luxfragil.com.png", "www.sassvienna.com.png", "www.silo.be.png", "www.subclub.co.uk.png", "www.sugarfactory.nl.png"],
	'bunch3' : ["www.baalsaal.com.png", "www.betanightclub.com.png", "www.byblos.hr.png", "www.flex.at.png", "www.ministryofsound.com.png", "www.pacha.com.png", "www.welove-music.com.png"]
};

var _allScreenshotsFullPathes = {
	"bunch1" : [{
		fname: "www.cieloclub.com.png",
		fullpath : ""
	}]
};

(function validateData() {
	for(var i = 0, _keys = Object.keys(_allScreenshots), ilen = _keys.length; i < ilen; i++) {
		var roots = {};
		for(var j = 0, jlen = _allScreenshots[_keys[i]].length; j < jlen; j++) {
			if(roots[_allScreenshots[_keys[i]][j]]) {
				throw new Error("The data is invalid: there are two screenshots points with the same name: '" + _allScreenshots[_keys[i]][j] + "'");
			}
			roots[_allScreenshots[_keys[i]][j]] = true;
		}
	}
	return true;
})();

(function trasnformImPathes(basePath){
	for(var _keys = Object.keys(_allScreenshots), i = _keys.length; i--;){
		_allScreenshotsFullPathes[_keys[i]] = [];
		for(var j = _allScreenshots[_keys[i]].length; j--; ){
			_allScreenshotsFullPathes[_keys[i]].push({
				fname: _allScreenshots[_keys[i]][j],
				fullpath: self.data.url(basePath + _keys[i] + "/" + _allScreenshots[_keys[i]][j])
			}); 
		}
	}
	return;
})(basePath);

module.exports = {
	getScreenshotObjs : function(bunchId) {
		var result = [];
		if( typeof bunchId == "number" || typeof bunchId == "string") {
			result = _allScreenshotsFullPathes["bunch" + bunchId];
		} else if(Array.isArray(bunchId)) {
			for(var i = 0, ilen = bunchId.length; i < ilen; i++) {
				result = result.concat(_allScreenshotsFullPathes["bunch" + bunchId[i]]);
			}
		} else {
			throw new Error("I don't know what you're asking");
		}
		return result;
	}
};