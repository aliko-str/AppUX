(function(){
	var ap = window.AppUX;
	ap.google = {};
	ap.google.tmpl = '	<li data-id="<%baseUrl%>" class="g">\
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
	ap.google.finishBtnTmpl = '<input type="button" class="finish-google-experience" id="finishGoogleExperience" value="I\'M DONE RE-ARRANGING" />';
	ap.google.websites = ap.options.websites;
})();
