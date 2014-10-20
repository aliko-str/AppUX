	_allWebsites = {
		"1": [ {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "https://www.youtube.com/watch?v=9vMs6OygZUc",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.designmynight.com",
			"title": "The Shoreditch Pub Crawl | London Bar Crawl Reviews",
			"href": "http://www.designmynight.com/london/bars/shoreditch/the-shoreditch-pub-crawl",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl East London - Free online booking, information ... my best friends, it was perfect, he took care of everything and we had so much fun!"
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "How to duplicate an element with jQuery clone method ...",
			"href": "https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-worker",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "jQuery Trick #1: clone() vs clone(true) | jQuery Tips and Tricks",
			"href": "http://www.howtogeek.com/",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "jQuery - Clone html and increment id of some elements ...",
			"href": "http://jqueryui.com/sortable/#default",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.jeasyui.com/index.php",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://getbootstrap.com/getting-started/#grunt",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.thefreedictionary.com/impression",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		 {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://stackoverflow.com/questions/2381336/detect-click-into-iframe-using-javascript",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		 {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.bajb.net/",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		}],
		"2": [],
		"3": []
	};
	
module.exports = {
	getWebsites: function(bunchId){
		var result = [];
		if(typeof bunchId == "number" || typeof bunchId == "string"){
			result = _allWebsites[bunchId.toString()];
		}else if(Array.isArray(bunchId)){
			for(var i = 0, ilen = bunchId.length; i < ilen; i++){
				result = result.concat(_allWebsites[bunchId[i]]);
			}
		}else{
			throw new Error("I don't know what you're asking");
		}
		return result;
	}
};
