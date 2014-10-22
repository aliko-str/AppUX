var _urlHostname = /^(?:http(?:s?)\:\/\/|~\/|\/)?((?:\w+:\w+@)?(?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|(?:(?:\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(?:\.(?:\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:\/){1}/i;

module.exports = {
	getUrlHostname: function(fullUrl){
		var hostname = _urlHostname.exec(fullUrl.toString());
		if(hostname){
			return hostname[1];
		}
		return "";
	}
};
