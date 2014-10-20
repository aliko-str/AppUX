	_allWebsites = {
		"1": [ {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
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
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "jQuery Trick #1: clone() vs clone(true) | jQuery Tips and Tricks",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "jQuery - Clone html and increment id of some elements ...",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		{
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		 {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		},
		 {
			"baseUrl": "www.tripadvisor.com",
			"title": "The Shoreditch Pub Crawl - London - Reviews of The",
			"href": "http://www.tripadvisor.com/Attraction_Review-g186338-d3931457-Reviews-The_Shoreditch_Pub_Crawl-London_England.html",
			"greenText": "[reserved for possible use]",
			"snippet": "The Shoreditch Pub Crawl, London: See 105 reviews, articles, and 8 photos of The Shoreditch Pub Crawl, ranked ... The staff was incredible and so much fun."
		}],
		"2": [],
		"3": []
	};
	
module.exports = {
	getWebsites: function(bunchId){
		var result = [];
		if(typeof bunchId == "string"){
			result = _allWebsites[bunchId];
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
