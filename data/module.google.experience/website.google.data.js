(function(){
	var ap = window.AppUX;
	ap.google = {};
	ap.google.tmpl = '	<li class="g">\
		<div class="rc" data-hveid="32">\
			<h3 class="r"><a href="<%href%>" ><%title%> <b>...</b></a></h3>\
			<div class="s">\
				<div>\
					<div class="f kv _SWb" style="white-space:nowrap">\
						<cite class="_Rm bc"><a href="<%href%>" ><%baseUrl%></a> › <a href="<%href%>" >Homepage</a></cite>\
					</div>\
					<span class="st"><%snippet%></span>\
				</div>\
			</div>\
		</div>\
	</li>';
	ap.google._allWebsites = {
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
		}]
	};
	ap.google.websites = ap.google._allWebsites[ap.options.groupNumber];
})();
